import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TicketStatus } from '../types/ticket-status.enum'
import { Event } from './event'

@Entity('tickets')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', nullable: false })
  eventId: number

  @ManyToOne(() => Event)
  event: Event

  @Column({ type: 'varchar', nullable: false, default: TicketStatus.Available })
  status: TicketStatus
}
