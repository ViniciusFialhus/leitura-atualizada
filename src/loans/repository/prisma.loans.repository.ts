import { Injectable } from "@nestjs/common";
import { Book, Loan, User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UpdateLoanDto } from "../dto/update-loan.dto";
import { CreateLoan, LoansRepository } from "./loans-repository";

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor(private prismaService: PrismaService) { }

  async createLoan(createLoan: CreateLoan): Promise<Loan> {
    const loanCreated = this.prismaService.loan.create({
      data: createLoan
    })

    return loanCreated
  }

  async findBook(bookId: string): Promise<Book> {
    return this.prismaService.book.findUnique({
      where: {
        id: bookId
      }
    })
  }

  async findUser(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    })
  }

  async findLoans(): Promise<Loan[]> {
    return await this.prismaService.loan.findMany()
  }

  async updateLoan(id: string, updateLoan: UpdateLoanDto): Promise<Loan> {
    const loanUpdated = await this.prismaService.loan.update({
      where: {
        id
      },
      data: {
        ...updateLoan
      }
    })

    return loanUpdated
  }
}