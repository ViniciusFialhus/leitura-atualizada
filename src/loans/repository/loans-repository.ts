import { Book, Loan, User } from "@prisma/client";
import { UpdateLoanDto } from "../dto/update-loan.dto";

export interface CreateLoan {
  bookId: string;
  userId: string;
  createdAt: Date;
  pickupDate: Date;
  dueTime: Date
}

export abstract class LoansRepository {
  abstract createLoan(createLoan: CreateLoan): Promise<Loan>
  abstract findBook(bookId: string): Promise<Book>
  abstract findUser(userId: string): Promise<User>
  abstract findLoans(): Promise<Loan[]>
  abstract updateLoan(id: string, updateLoan: UpdateLoanDto): Promise<Loan>
}