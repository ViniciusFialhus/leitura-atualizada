import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { BooksRepository } from './repository/books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly BooksRepository: BooksRepository) { }

  // async create(createBookDto: CreateBookDto) {
  //   return this.BooksRepository.createBook(createBookDto)
  // }

  findAll() {
    return this.BooksRepository.findAllBooks()
  }

  searchBook(q: Book) {
    if (!q.title && !q.author && !q.genre) {
      throw new HttpException('para fazer a pesquisa precisa informa o titulo, autor ou gênero do livro',
        HttpStatus.BAD_REQUEST)
    }

    return this.BooksRepository.searchBook(q)
  }

  findOne(id: string) {
    const book = this.BooksRepository.findOneBook(id)

    if (!book) {
      throw new HttpException('Este livro não esta cadastrado', HttpStatus.BAD_REQUEST)
    }

    return this.BooksRepository.findOneBook(id)
  }

  // update(id: string, updateBookDto: UpdateBookDto) {

  //   const book = this.BooksRepository.findOneBook(id)

  //   if (!book) {
  //     throw new HttpException('Este livro não esta cadastrado', HttpStatus.BAD_REQUEST)
  //   }

  //   return this.BooksRepository.updateBook(id, updateBookDto)
  // }

  remove(id: string) {
    const book = this.BooksRepository.findOneBook(id)

    if (!book) {
      throw new HttpException('Este livro não esta cadastrado', HttpStatus.BAD_REQUEST)
    }

    return this.BooksRepository.removeBook(id)
  }
}