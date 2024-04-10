import { ApiProperty } from "@nestjs/swagger"

export class ResponseWishList {
  @ApiProperty()
  entryId: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  bookId: string
}