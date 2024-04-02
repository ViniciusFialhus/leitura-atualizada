import { IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;
}
