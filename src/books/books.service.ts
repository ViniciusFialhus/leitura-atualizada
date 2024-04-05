import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { BooksRepository } from './repository/books.repository';
import { HttpService } from '@nestjs/axios';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly httpSevice: HttpService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { isbn } = createBookDto;
    const bookExists = await this.booksRepository.findBookByIsbn(isbn);

    if (bookExists) {
      throw new HttpException('Livro já cadastrado', HttpStatus.BAD_REQUEST);
    }

    try {
      const bookInfo = await this.httpSevice.axiosRef.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
      );

      let image: string = bookInfo.data.items[0].volumeInfo.imageLinks;
      const publishedDate: Date = new Date(
        bookInfo.data.items[0].volumeInfo.publishedDate,
      );

      if (image === undefined) {
        image = null;
      } else {
        image = bookInfo.data.items[0].volumeInfo.imageLinks.smallThumbnail;
      }

      const newBook: Book = {
        title: bookInfo.data.items[0].volumeInfo.title,
        author: bookInfo.data.items[0].volumeInfo.authors[0],
        genre: bookInfo.data.items[0].volumeInfo.categories[0],
        description: bookInfo.data.items[0].volumeInfo.description || null,
        isbn: isbn,
        publishedAt: publishedDate || null,
        imgUrl: image || null,
        status: BookStatus.AVAILABLE,
      };

      return await this.booksRepository.createBook(newBook);
    } catch (error) {
      throw new HttpException(
        'Data could not be recovered',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.booksRepository.findAllBooks();
  }

  async searchBook(q: string): Promise<Book[]> {
    if (!q) {
      throw new HttpException(
        'Para fazer a pesquisa é necessário informar o título ou autor do livro',
        HttpStatus.BAD_REQUEST,
      );
    }
    const search = await this.booksRepository.searchBook(q);
    if (search.length < 1) {
      throw new HttpException(
        'Nenhum resultado para a busca',
        HttpStatus.NOT_FOUND,
      );
    }
    return search;
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOneBook(id);

    if (book === null) {
      throw new HttpException(
        'Este livro não está cadastrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOneBook(id);

    if (book === null) {
      throw new HttpException(
        'Este livro não está cadastrado',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return await this.booksRepository.updateBook(id, updateBookDto);
    } catch (error) {
      throw new HttpException(
        'Apenas campos contidos no tipo Book podem estar inseridos no Body da requisição',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const book = await this.booksRepository.findOneBook(id);

    if (book === null) {
      throw new HttpException(
        'Este livro não está cadastrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.booksRepository.removeBook(id);
    return;
  }
}
