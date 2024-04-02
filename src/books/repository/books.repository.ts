import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../entities/book.entity';
import { HttpService } from '@nestjs/axios';
import { UpdateBookDto } from '../dto/update-book.dto';



@Injectable()
export class BooksRepository {
  constructor(
    private prisma: PrismaService,
    private httpSevice: HttpService,
  ) { }

  async createBook(createBookDto: CreateBookDto) {
    const { isbn } = createBookDto;
    const bookInfo = await this.httpSevice.axiosRef.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
    );

    let image: string = bookInfo.data.items[0].volumeInfo.imageLinks;
    const ano: Date = new Date(bookInfo.data.items[0].volumeInfo.publishedDate)

    if (image === undefined) {
      image = null;
    } else {
      image = bookInfo.data.items[0].volumeInfo.imageLinks.smallThumbnail;
    }

    const newbook: CreateBookDto = {
      title: bookInfo.data.items[0].volumeInfo.title,
      author: bookInfo.data.items[0].volumeInfo.authors[0],
      genre: bookInfo.data.items[0].volumeInfo.categories[0],
      description: bookInfo.data.items[0].volumeInfo.description || null,
      isbn: isbn,
      publishedAt: ano || null,
      imgUrl: image || null,
    };

    return this.prisma.book.create({
      data: newbook,
    });
  }

  findAllBooks() {
    return this.prisma.book.findMany();
  }

  searchBook(q: Book) {
    if (!q.title && !q.genre) {
      return this.prisma.book.findMany({
        where: {
          author: q.author,
        },
      });
    }
    if (!q.author && !q.genre) {
      return this.prisma.book.findMany({
        where: {
          title: q.title,
        },
      });
    }
    if (!q.author && !q.title) {
      return this.prisma.book.findMany({
        where: {
          genre: q.genre,
        },
      });
    }
  }

  findOneBook(id: string) {
    return this.prisma.book.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  updateBook(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  removeBook(id: string) {
    return this.prisma.book.delete({
      where: {
        id,
      },
    });
  }

  // findBookIsbn(isbn: string) {
  //     return this.prisma.book.findu({
  //         where: {
  //             isbn,
  //         },
  //     });
  // }
}