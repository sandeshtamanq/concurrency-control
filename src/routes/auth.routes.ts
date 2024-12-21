import { Router } from 'express'
import { loginHandler, registerHandler } from '../controllers/auth.controller'
import { LoginDto } from '../dtos/login.dto'
import { RegisterDto } from '../dtos/register.dto'
import { validationMiddleware } from '../middlewares/validationMiddleware'

const router = Router()

router.post('/register', validationMiddleware(RegisterDto), registerHandler)
router.post('/login', validationMiddleware(LoginDto), loginHandler)

export default router
//
