import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'timestamptz', nullable: false })
  date: Date

  @Column({ type: 'varchar', nullable: false })
  venue: string

  @Column({ type: 'int', nullable: false })
  price: number

  @Column({ type: 'int', nullable: false })
  total_tickets: number
}
