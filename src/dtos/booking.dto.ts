import { IsArray, Validate } from 'class-validator'

export class BookingDto {
  @IsArray()
  @Validate((value: number[]) => value.every((v) => typeof v === 'number'))
  tickets: number[]
}
