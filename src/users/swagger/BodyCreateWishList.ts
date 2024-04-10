import { ApiProperty } from "@nestjs/swagger";

export class BodyCreateWishList {
  @ApiProperty()
  bookId: string
}