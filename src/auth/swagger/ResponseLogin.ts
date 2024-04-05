import { ApiProperty } from "@nestjs/swagger";

export class ResponseLogin {
  @ApiProperty()
  access_token: string

  @ApiProperty()
  refresh_token: string
}