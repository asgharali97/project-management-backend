import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError,js'
import { User } from '../modules/user.model.js'

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header('Authorization').replace("Bearer", "")

    if (!accessToken) {
        throw new ApiError(400, "unauthorized request")
    }

    try {
        const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECERET)
        if (!verify) {
            throw new ApiError(400, "unauthorized request")
        }

        const user = await findById(verify._id).select('-password -refreshToken -emailVerifactionToken -emailVerifactionExpiry');
        if (!user) {
            throw new ApiError(404, "Invalid accessToken ")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(400, "got error while verifyJWT", error)
    }
}

export { verifyJWT }