import { Injectable } from '@nestjs/common';
import { Book, Loan } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateLoanDto } from '../dto/update-loan.dto';
import { CreateLoan } from '../models/CreateLoan';
import { LoansRepository } from './loans-repository';

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor(private prismaService: PrismaService) { }

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

  async findLoans(): Promise<Loan[]> {
    return await this.prismaService.loan.findMany();
  }

  async findLoan(id: string): Promise<Loan> {
    return await this.prismaService.loan.findUnique({
      where: {
        id
      }
    })
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
