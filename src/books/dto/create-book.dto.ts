import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsISBN,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Book } from '../entities/book.entity';
import { BookStatus } from '@prisma/client';

export class CreateBookDto implements Book {
  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MaxLength(100, { message: 'Must`ve less than 100 characters' })
  @ApiProperty({ required: false })
  title: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MaxLength(100, { message: 'Must`ve less than 100 characters' })
  @ApiProperty({ required: false })
  author: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MinLength(10, { message: 'Must`ve 10 or more characters' })
  @MaxLength(13, { message: 'Must`ve less than 13 characters' })
  @IsISBN(undefined, { message: 'Must be a valid ISBN code' })
  @ApiProperty()
  isbn: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @IsUrl(undefined, { message: 'Must be a valid URL' })
  @ApiProperty({ required: false })
  imgUrl: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  @MaxLength(20, { message: 'Must`ve less than 20 characters' })
  @ApiProperty({ required: false })
  genre: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @MaxLength(255, { message: 'Must`ve less than 255 characters' })
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @IsString({ message: 'Must be a String' })
  @IsDate({ message: 'Must`ve a valid JS Date format' })
  @ApiProperty({ default: 'Date', required: false })
  publishedAt: Date;

  @IsOptional()
  status: BookStatus;
}
