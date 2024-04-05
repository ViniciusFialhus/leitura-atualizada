import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksRepository {
  constructor(private prisma: PrismaService) {}

  async createBook(newBookData: Book): Promise<Book> {
    return await this.prisma.book.create({
      data: newBookData,
    });
  }

  findAllBooks(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  async searchBook(q: string): Promise<Book[]> {
    return await this.prisma.$queryRawUnsafe(
      `SELECT * FROM "books" WHERE (title ILIKE $1 OR author ILIKE $1)`,
      `%${q}%`,
    );
  }

  async findOneBook(id: string): Promise<Book> {
    return await this.prisma.book.findUnique({
      where: {
        id,
      },
    });
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    return await this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async removeBook(id: string) {
    return await this.prisma.book.delete({
      where: {
        id,
      },
    });
  }

  async findBookByIsbn(isbn: string): Promise<Book> {
    return await this.prisma.book.findUnique({
      where: {
        isbn,
      },
    });
  }
}
