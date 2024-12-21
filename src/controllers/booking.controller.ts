import { Request, Response } from 'express'
import { In } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { BookingDto } from '../dtos/booking.dto'
import { Event } from '../entities/event'
import { Ticket } from '../entities/ticket'
import { produceMessage } from '../services/kafka/producer'
import { redis } from '../services/redis'
import { TicketStatus } from '../types/ticket-status.enum'
import { ApiError } from '../utils/ApiError'
import { asyncHandler } from '../utils/asyncHandler'

const eventRepository = AppDataSource.getRepository(Event)
const ticketRepository = AppDataSource.getRepository(Ticket)
// const BookingRepository = AppDataSource.getRepository(Booking)
export const bookingHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id ?? ''
    const eventId = req.params['eventId']
    const tickets: BookingDto = req.body

    if (!eventId || isNaN(+eventId)) {
      res.status(400).json(new ApiError(400, 'Invalid Event Id'))
      return
    }

    const event = await eventRepository.findOne({ where: { id: +eventId } })

    if (!event) {
      res.status(404).json(new ApiError(404, 'Event not found'))
      return
    }

    const availableTickets = await ticketRepository.find({
      where: {
        eventId: +eventId,
        id: In(tickets.tickets),
        status: TicketStatus.Available,
      },
    })

    if (availableTickets.length !== tickets.tickets.length) {
      res.status(404).json(new ApiError(404, 'Ticket not available'))
      return
    }

    const lockSeats = await Promise.all(
      availableTickets.map((ticket) => {
        return redis.set(`lock:${ticket.id}`, userId, 'EX', 1000, 'NX')
      }),
    )

    if (lockSeats.includes(null)) {
      res.status(409).json(new ApiError(409, 'Ticket is already locked'))
      return
    }

    await produceMessage({ eventId, userId })

    redis.del(availableTickets.map((ticket) => `lock:${ticket.id}`))

    res.status(200).json({
      message: 'success',
    })
  },
)
