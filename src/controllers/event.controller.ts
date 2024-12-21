import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { EventDto } from '../dtos/event.dto'
import { Event } from '../entities/event'
import { Ticket } from '../entities/ticket'
import { TicketStatus } from '../types/ticket-status.enum'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

const eventRepository = AppDataSource.getRepository(Event)
const ticketRepository = AppDataSource.getRepository(Ticket)
export const createEventHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const event: Partial<EventDto> = req.body
    try {
      const existingEvent = await eventRepository.findOne({
        where: { name: event.name },
      })

      console.log(existingEvent)
      if (existingEvent) {
        res.status(409).json({ error: 'Event already exists' })
        return
      }

      const newEvent = await eventRepository.save(eventRepository.create(event))

      const tickets: Ticket[] = []
      for (let i = 0; i < newEvent.total_tickets; i++) {
        tickets.push(
          ticketRepository.create({
            event: newEvent,
            status: TicketStatus.Available,
          }),
        )
      }

      await ticketRepository.save(tickets)

      res
        .status(201)
        .json(new ApiResponse(201, 'Event Created Successfully!', newEvent))
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(new ApiError(500, err.message))
        return
      }
      res.status(500).json(new ApiError(500, 'Internal Server Error'))
    }
  },
)
