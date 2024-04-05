import { IsNotEmpty, IsUUID } from 'class-validator';
import { Loan } from '../entities/loan.entity';

export class CreateLoanDto implements Loan {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsUUID('all', { message: 'Must be a valid UUID' })
  userId: string;
}
