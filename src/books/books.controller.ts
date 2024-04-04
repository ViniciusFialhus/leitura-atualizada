import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('all')
  findAllBook() {
    return this.booksService.findAll();
  }

  @Get('search')
  searchBook(@Query() query: Book) {
    return this.booksService.searchBook(query);
  }

  @Get(':id')
  findOneBook(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  removeBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
