import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { HttpModule } from '@nestjs/axios';
import { BooksRepository } from './repository/books.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  exports: [BooksService],
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, PrismaService],
})
export class BooksModule {}
