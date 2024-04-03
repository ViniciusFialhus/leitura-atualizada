import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;
}
