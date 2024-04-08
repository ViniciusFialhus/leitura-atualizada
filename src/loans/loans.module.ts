import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { WishlistRepository } from 'src/users/repository/user-wishlist.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { UsersModule } from 'src/users/users.module';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { LoansRepository } from './repository/loans-repository';
import { PrismaLoansRepository } from './repository/prisma.loans.repository';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule],
  controllers: [LoansController],
  providers: [
    LoansService,
    PrismaService,
    {
      provide: LoansRepository,
      useClass: PrismaLoansRepository,
    },
    UserRepository,
    WishlistRepository,
    JwtService,
  ],
})
export class LoansModule {}
