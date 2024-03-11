import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Book } from '../entities/book.entity';

export class CreateBookDto implements Book {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: String;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author: String;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(13)
  isbn: String;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: String;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  genre: String;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: String;

  @IsOptional()
  @IsString()
  @IsDate()
  publishedAt: Date;
}
