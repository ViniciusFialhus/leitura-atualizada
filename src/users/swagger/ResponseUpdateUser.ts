import { ApiProperty } from "@nestjs/swagger";

export class ResponseUpdateUser {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  isAdm: boolean;

  @ApiProperty({ required: false })
  password: string;

  @ApiProperty({ required: false })
  username: string;
}