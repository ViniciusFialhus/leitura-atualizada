import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [UsersModule, BooksModule, AuthModule, LoansModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
