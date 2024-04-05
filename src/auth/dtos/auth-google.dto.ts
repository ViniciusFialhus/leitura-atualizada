import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { AuthLogin } from '../entities/auth-login.entity';
export class AuthGoogleDto implements Partial<AuthLogin> {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  picture: string;

  @IsString()
  @ApiProperty()
  accessToken: string;

  @IsString()
  @ApiProperty()
  refreshToken: string;

  @IsBoolean()
  @ApiProperty()
  isAdm?: boolean;
}
