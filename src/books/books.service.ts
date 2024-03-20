import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { BooksRepository } from './repository/books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly BooksRepository: BooksRepository) { }

  async create(createBookDto: CreateBookDto) {
    return this.BooksRepository.createBook(createBookDto)
  }

  findAll() {
    return this.BooksRepository.findAllBooks()
  }

  searchBook(q: Book) {
    return this.BooksRepository.searchBook(q)
  }

  findOne(id: string) {
    return this.BooksRepository.findOneBook(id)
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.BooksRepository.updateBook(id, updateBookDto)
  }

  remove(id: string) {
    return this.BooksRepository.removeBook(id)
  }
}
