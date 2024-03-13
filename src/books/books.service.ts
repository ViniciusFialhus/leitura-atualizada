import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService, private readonly httpSevice: HttpService) { }

  async create(createBookDto: CreateBookDto) {
    const { isbn } = createBookDto
    const response = await this.httpSevice.axiosRef.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    return response.data
    // filtra dados
  }

  findAll() {
    return this.prisma.Book.findMany()
  }

  searchBook(q: Book) {
    if (!q.title) {
      return this.prisma.Book.findMany({
        where: {
          author: q.author
        }
      })
    }
    if (!q.author) {
      return this.prisma.Book.findMany({
        where: {
          title: q.title
        }
      })
    }
  }

  findOne(id: string) {
    return this.prisma.Book.findUnique({
      where: {
        id
      }
    });
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.Book.update({
      where: { id },
      data: updateBookDto
    })
  }

  remove(id: string) {
    return this.prisma.Book.delete({
      where: {
        id
      }
    })
  }
}
