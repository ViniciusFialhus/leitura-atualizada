import { Injectable } from '@nestjs/common';
import { Loan } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateLoan } from '../models/CreateLoan';
import { LoansRepository } from './loans-repository';

@Injectable()
export class PrismaLoansRepository implements LoansRepository {
  constructor(private prismaService: PrismaService) {}

  async createLoan(createLoan: CreateLoan): Promise<Loan> {
    const loanCreated = await this.prismaService.loan.create({
      data: createLoan,
    });

    return loanCreated;
  }

  async findLoans(): Promise<any[]> {
    return await this.prismaService.loan.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        book: {
          select: {
            title: true,
            imgUrl: true,
          },
        },
      },
    });
  }

  async findLoan(id: string): Promise<Loan> {
    return await this.prismaService.loan.findUnique({
      where: {
        id,
      },
    });
  }

  async updateLoan(id: string, updateLoan: Partial<Loan>): Promise<Loan> {
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
