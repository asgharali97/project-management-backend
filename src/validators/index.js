import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .isEmail()
            .withMessage("Email is not valid")
            .notEmpty()
            .withMessage("Email is required")
            .trim(),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage('Username must be lowercase')
            .isLength({ min: 3 })
            .withMessage('Username must be 3 characters long'),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage('Password must be 8 characters long'),
        body("fullName")
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage('Full name must be 3 characters long')
    ]
}


const userLoginValidation = () => {
    return [
        body("email")
            .isEmail()
            .withMessage("Email is not valid")
            .notEmpty()
            .withMessage("Email is required")
            .trim(),
        body('password')
            .notEmpty()
            .withMessage('Passowrd is required')
    ]
}

export { userRegisterValidator, userLoginValidation }