import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiRespons.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../modules/user.model.js';
import { emailVerifactionContent, sendMail } from '../utils/mail.js';

const genrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.genrateAccessToken();
        const refreshToken = await user.genrateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        console.log(accessToken)
        console.log(refreshToken)
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "got Error while genrating tokens", [error])
    }
}

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "with this email or username user already exits, create with another one please", [])
    }

    const user = await User.create({
        email,
        username,
        password,
        fullName,
        isEmailVerfied: false
    })

    const { unHashed, hashedToken, tokenExpiry } = user.genrateTemporaryToken()

    user.emailVerifactionToken = hashedToken
    user.emailVerifactionExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendMail({
        email: user?.email,
        subject: "Verify your email",
        mailgenContent: emailVerifactionContent(
            user.username,
            `${req.protocl}://${req.get("host")}/api/v1/users/verify-email/${unHashed}`
        )
    })

    const createdUser = await User.findById(user._id)
        .select('-password -refreshToken -emailVerifactionToken -emailVerifactionExpiry')

    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while creating user")
    }
    res.status(201).json(new ApiResponse(201, "User created successfuly", { createdUser }))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email && password) {
        throw new ApiError(400, "Email and password are required please fill them ")
    }
    console.log(email)
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found with this email")
    }

    const passworCorrect = user.isPasswordCorrect(password)

    if (!passworCorrect) {
        throw new ApiError(400, "Wrong password please add correct one")
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id)

    const loggedUser = await User.findById(user._id).select('-password -refreshToken -emailVerifactionToken -emailVerifactionExpiry')

    const options = {
        httpOnly: true,
        secure: true,
    }
    console.log(accessToken)
    return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    loggedUser,
                    accessToken
                },
                'user loggedIn successfuly'
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(req.user._id, {
        $or: {
            refreshToken: ""
        }
    }, { new: true })

    const option = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .clearCookie('accessToken', option)
        .clearCookie('refreshToken', option)
        .json(
            new ApiResponse(
                200,
                {},
                "logout successfuly"
            )
        )
})

export { createUser, loginUser,logoutUser }