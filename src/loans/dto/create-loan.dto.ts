import { IsUUID } from 'class-validator';
import { Loan } from '../entities/loan.entity';

export class CreateLoanDto implements Loan {
  @IsUUID('all', { message: 'Must be a valid UUID' })
  adminId: string;

  @IsUUID('all', { message: 'Must be a valid UUID' })
  userId: string;

  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;
}
