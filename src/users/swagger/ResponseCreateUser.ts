import { ApiProperty } from "@nestjs/swagger";

export class ResponseCreateuser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isAdm: boolean;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  refreshToken: string;
}