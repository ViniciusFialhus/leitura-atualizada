import { IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';

export class AuthPayloadDto implements Partial<AuthLogin> {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;
}
