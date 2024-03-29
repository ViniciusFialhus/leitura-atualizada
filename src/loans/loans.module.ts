import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { LoansRepository } from "./repository/loans-repository";
import { PrismaLoansRepository, } from './repository/prisma.loans.repository';

@Module({
  controllers: [LoansController],
  providers: [LoansService, PrismaService, {
    provide: LoansRepository,
    useClass: PrismaLoansRepository
  }],
})
export class LoansModule { }
