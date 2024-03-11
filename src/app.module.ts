import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, BooksModule, LoansModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
