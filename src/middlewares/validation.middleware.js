import { validationResult } from "express-validator";
import { ApiError } from '../utils/ApiError.js'


export const validate = (req, res, next) => {
    const error = validationResult(req)

    if(error.isEmpty()){
        return next()
    }
    const extractedErrors = []
    error.array().map((err) => extractedErrors.push({[err.paht]:err.msg}))

    throw new ApiError(400, "Recived Data is not valid", extractedErrors)
}