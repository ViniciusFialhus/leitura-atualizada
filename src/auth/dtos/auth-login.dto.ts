import { IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
import { generateFromEmail } from 'unique-username-generator';

export class AuthLoginDto implements Partial<AuthLogin> {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username?: string;

  generateUsername(): void {
    this.username = generateFromEmail(this.email);
  }
}
