import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoansController } from './loans.controller';
import { LoansRepository } from "./repository/loans-repository";
import { PrismaLoansRepository, } from './repository/prisma.loans.repository';

@Module({
  controllers: [LoansController],
  providers: [PrismaService, {
    provide: LoansRepository,
    useClass: PrismaLoansRepository
  }],
})
export class LoansModule { }
