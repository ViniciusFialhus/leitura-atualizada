import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
export class AuthGoogleDto implements Partial<AuthLogin> {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: "Must be a String" })
  firstName: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: "Must be a String" })
  lastName: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: "Must be a String" })
  picture: string;

  @IsString({ message: "Must be a String" })
  accessToken: string;

  @IsOptional()
  @IsString({ message: "Must be a String" })
  refreshToken: string;

  @IsBoolean({ message: "Must be a boolean value" })
  isAdm?: boolean;
}
