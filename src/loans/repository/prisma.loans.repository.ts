import { Injectable } from '@nestjs/common';
import { Book, Loan, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateLoanDto } from '../dto/update-loan.dto';
import { LoansRepository } from './loans-repository';
import { CreateLoan } from '../models/CreateLoan';

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor(private prismaService: PrismaService) {}

  async createLoan(createLoan: CreateLoan): Promise<Loan> {
    const loanCreated = await this.prismaService.loan.create({
      data: createLoan,
    });

    return loanCreated;
  }

  async findBook(bookId: string): Promise<Book> {
    return await this.prismaService.book.findUnique({
      where: {
        id: bookId,
      },
    });
  }

  async findUser(userId: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findLoans(): Promise<Loan[]> {
    return await this.prismaService.loan.findMany();
  }

  async updateLoan(id: string, updateLoan: UpdateLoanDto): Promise<Loan> {
    const loanUpdated = await this.prismaService.loan.update({
      where: {
        id,
      },
      data: {
        ...updateLoan,
      },
    });

    return loanUpdated;
  }
}
