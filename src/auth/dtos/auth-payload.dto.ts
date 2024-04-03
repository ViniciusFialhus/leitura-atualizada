import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';

export class AuthPayloadDto implements Partial<AuthLogin> {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  sub: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;
}
