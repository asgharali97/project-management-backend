import { Router } from 'express'
import { createUser, loginUser, logoutUser } from '../controllers/user.controller.js'
import { userLoginValidation, userRegisterValidator } from '../validators/index.js'
import { validate } from '../middlewares/validation.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router()

router.route('/register').post(userRegisterValidator(), validate, createUser)
router.route('/login').post(userLoginValidation(), validate, loginUser)
router.route('/logout').post(verifyJWT, logoutUser)

export default router 