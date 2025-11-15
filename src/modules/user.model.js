import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import crypto from 'crypto'
const userSchema = mongoose.Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String
            },
            default: {
                url: "https://i.pinimg.com/736x/c7/9b/3c/c79b3ca33bc6806e2f38b0711443b3ea.jpg",
                localPath: ""
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        isEmailVerfied: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        fogretPasswordToken: {
            type: String
        },
        fogretPasswordExpiry: {
            type: Date
        },
        emailVerifactionToken: {
            type: String
        },
        emailVerifactionExpiry: {
            type: Date
        }
    }, { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()
    try {
        this.password = await bcrypt.hash(this.password, 12)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genrateAccessToken = async function () {
    return await jwt.sign({
        _id: this._id,
        username: this.username
    }, process.env.ACCESS_TOKEN_SECERET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.genrateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id,
        username: this.username
    }, process.env.REFRESH_TOKEN_SECERET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

userSchema.methods.genrateTemporaryToken = async function () {
    const unHashedToken = crypto.randomBytes(10).toString("hex")
    const hashedToken = crypto
        .createHmac('sha256', process.env.TOKEN_SECRET)
        .update(unHashedToken)
        .digest('hex')
    const tokenExpiry = Date.now() + 20 * 60 * 1000
    return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model('User', userSchema)