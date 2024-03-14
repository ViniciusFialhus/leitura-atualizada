import { IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';

export class AuthJwtDto implements Partial<AuthLogin> {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
