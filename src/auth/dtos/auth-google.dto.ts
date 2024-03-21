import { IsEmail, IsString, IsBoolean } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
export class AuthGoogleDto implements Partial<AuthLogin> {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  picture: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsBoolean()
  isAdm?: boolean;
}
