import { Router } from 'express'
import { createEventHandler } from '../controllers/event.controller'
import { EventDto } from '../dtos/event.dto'
import { authMiddleware } from '../middlewares/authMiddleware'
import { validationMiddleware } from '../middlewares/validationMiddleware'

const router = Router()
router.post(
  '/',
  authMiddleware,
  validationMiddleware(EventDto),
  createEventHandler,
)

export { router as eventRouter }
