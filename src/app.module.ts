import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [UsersModule, BooksModule, LoansModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
