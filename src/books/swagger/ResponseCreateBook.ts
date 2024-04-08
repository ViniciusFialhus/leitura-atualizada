import { ApiProperty } from "@nestjs/swagger";

export class ResponseCreateBook {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isbn: string;

  @ApiProperty()
  imgUrl: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}