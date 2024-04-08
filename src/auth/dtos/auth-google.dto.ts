import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
export class AuthGoogleDto implements Partial<AuthLogin> {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsString({ message: "Must be a String" })
  firstName: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsString({ message: "Must be a String" })
  lastName: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsString({ message: "Must be a String" })
  picture: string;

  @IsString({ message: "Must be a String" })
  @ApiProperty()
  accessToken: string;

  @IsOptional()
  @ApiProperty()
  @IsString({ message: "Must be a String" })
  refreshToken: string;

  @IsBoolean({ message: "Must be a boolean value" })
  @ApiProperty()
  isAdm?: boolean;
}