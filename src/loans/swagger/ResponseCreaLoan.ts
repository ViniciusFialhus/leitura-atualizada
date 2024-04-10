import { ApiProperty } from "@nestjs/swagger"

export class ResponseCreateLoan {
  @ApiProperty()
  bookId: string

  @ApiProperty()
  pickupDate: Date
}