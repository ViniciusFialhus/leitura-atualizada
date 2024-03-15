import { Injectable } from "@nestjs/common";
import { Book, Loan, User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
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
}