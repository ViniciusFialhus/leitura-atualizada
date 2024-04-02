import { Book, Loan } from '@prisma/client';
import { UpdateLoanDto } from '../dto/update-loan.dto';
import { CreateLoan } from '../models/CreateLoan';

export abstract class LoansRepository {
  abstract createLoan(createLoan: CreateLoan): Promise<Loan>;
  abstract findBook(bookId: string): Promise<Book>;
  abstract findLoans(): Promise<Loan[]>;
  abstract findLoan(id: string): Promise<Loan>;
  abstract updateLoan(id: string, updateLoan: UpdateLoanDto): Promise<Loan>;
}
