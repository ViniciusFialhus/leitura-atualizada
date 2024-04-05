import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';

export class AuthPayloadDto implements Partial<AuthLogin> {
  @IsString()
  @ApiProperty()
  sub: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
