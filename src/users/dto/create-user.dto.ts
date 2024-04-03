import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto implements User {
  @IsString({ message: 'Must be a String' })
  @MinLength(4, { message: 'Must have at least 4 characters' })
  name: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;

  @IsBoolean({ message: 'Must be a boolean value' })
  isAdm: boolean;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MinLength(8, { message: 'Must have at least 8 characteres' })
  @MaxLength(32, { message: 'Must have less then 32 characteres' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/gm, {
    message: `At least one digit [0-9] 
    At least one lowercase character [a-z] 
    At least one uppercase character [A-Z] 
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\] 
    At least 8 characters in length, but no more than 32.`,
  })
  password: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MinLength(4, { message: 'Must have at least 4 characteres' })
  username: string;
}
