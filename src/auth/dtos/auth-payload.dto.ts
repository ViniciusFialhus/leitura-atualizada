import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthLogin } from '../entities/auth-login.entity';

export class AuthPayloadDto implements Partial<AuthLogin> {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsString({ message: 'Must be a String' })
  sub: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;
}