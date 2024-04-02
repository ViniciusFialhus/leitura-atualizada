import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  // createBook(@Body() createBookDto: CreateBookDto) {
  //   return this.booksService.create(createBookDto)
  // }

  @Get()
  findAllBook() {
    return this.booksService.findAll()
  }

  @Get('search')
  searchBook(@Query() query: Book) {
    return this.booksService.searchBook(query)
  }

  @Get(':id')
  findOneBook(@Param('id') id: string) {
    return this.booksService.findOne(id)
  }

  @Patch(':id')
  // updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.booksService.update(id, updateBookDto)
  // }

  @Delete(':id')
  removeBook(@Param('id') id: string) {
    return this.booksService.remove(id)
  }
}
