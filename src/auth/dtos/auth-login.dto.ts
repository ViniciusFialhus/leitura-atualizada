import { IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
export class AuthLoginDto implements Partial<AuthLogin> {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
