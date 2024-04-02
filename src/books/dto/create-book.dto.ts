import {
  IsDate,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Book } from '../entities/book.entity';

export class CreateBookDto implements Book {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MaxLength(100, { message: 'Must`ve less than 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MaxLength(100, { message: 'Must`ve less than 100 characters' })
  author: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MinLength(10, { message: 'Must`ve 10 or more characters' })
  @MaxLength(13, { message: 'Must`ve less than 13 characters' })
  @IsISBN(undefined, { message: 'Must be a valid ISBN code' })
  isbn: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @IsUrl(undefined, { message: 'Must be a valid URL' })
  imgUrl: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MaxLength(20, { message: 'Must`ve less than 20 characters' })
  genre: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MaxLength(255, { message: 'Must`ve less than 255 characters' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @IsDate({ message: 'Must`ve a valid JS Date format' })
  publishedAt: Date;
}
