import { IsNotEmpty, IsString } from 'class-validator'

export class EventDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  date: Date

  @IsString()
  @IsNotEmpty()
  venue: string

  @IsNotEmpty()
  price: number

  @IsNotEmpty()
  total_tickets: number
}
