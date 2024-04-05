import { Loan } from '@prisma/client';
import { CreateLoan } from '../models/CreateLoan';

export abstract class LoansRepository {
  abstract createLoan(createLoan: CreateLoan): Promise<Loan>;
  abstract findLoans(): Promise<Loan[]>;
  abstract findLoan(id: string): Promise<Loan>;
  abstract updateLoan(id: string, updateLoan: Partial<Loan>): Promise<Loan>;
}
