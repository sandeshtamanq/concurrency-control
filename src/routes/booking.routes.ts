import { Router } from 'express'
import { bookingHandler } from '../controllers/booking.controller'
import { BookingDto } from '../dtos/booking.dto'
import { authMiddleware } from '../middlewares/authMiddleware'
import { validationMiddleware } from '../middlewares/validationMiddleware'

const router = Router()
router.post(
  '/:eventId',
  authMiddleware,
  validationMiddleware(BookingDto),
  bookingHandler,
)

export default router
