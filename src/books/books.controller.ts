import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorSwagger } from 'src/helpers/swagger/ErrorSwagger';
import { ResponseCreateBook } from './swagger/ResponseCreateBook';
import { UpdateBookSwagger } from './swagger/UpdateBooSwagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin.guard';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @ApiOperation({ summary: "Adiciona um novo livro no sistema" })
  @ApiResponse({ status: 201, description: "Livro adicionado com sucesso", type: ResponseCreateBook })
  @ApiBody({ type: CreateBookDto, description: "Objeto book que precisa ser adicionado à loja" })
  @ApiBearerAuth("KEY_AUTH")
  @HttpCode(HttpStatus.CREATED)
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get(@Get('all'))
  @ApiOperation({ summary: "Lista os livros cadastrados no sistema" })
  @ApiResponse({ status: 200, description: "Lista de livros retornada com sucesso", type: ResponseCreateBook, isArray: true })
  @ApiBearerAuth("KEY_AUTH")
  findAllBook() {
    return this.booksService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: "Encontra um livro por title, autor ou gênero" })
  @ApiResponse({ status: 200, description: "Livro encontrado com sucesso", type: ResponseCreateBook })
  @ApiQuery({ name: 'q', description: "title, autor ou gênero do livro" })
  @ApiBearerAuth("KEY_AUTH")
  searchBook(@Query('q') query: string) {
    return this.booksService.searchBook(query);
  }

  @Get(':id')
  @ApiOperation({ summary: "Encontra um livro pelo ID" })
  @ApiResponse({ status: 200, description: "Livro encontrado com sucesso", type: ResponseCreateBook })
  @ApiResponse({ status: 400, description: "Livro não encontrado", type: ErrorSwagger })
  @ApiParam({ name: 'id', description: "ID do livro a ser buscado" })
  @ApiBearerAuth("KEY_AUTH")
  findOneBook(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: "Atualiza um livro" })
  @ApiResponse({ status: 200, description: "Livro atualizado com sucesso", type: ResponseCreateBook })
  @ApiResponse({ status: 400, description: "Livro não cadastrado", type: ErrorSwagger })
  @ApiBody({ type: UpdateBookSwagger, description: "Objeto do livro para atualização" })
  @ApiParam({ name: 'id', description: "ID do livro a ser atualizado" })
  @ApiBearerAuth("KEY_AUTH")
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Deleta um livro" })
  @ApiResponse({ status: 204, description: "Livro deletado com sucesso" })
  @ApiResponse({ status: 400, description: "Livro não cadastrado", type: ErrorSwagger })
  @ApiParam({ name: 'id', description: "ID do livro a ser deletado" })
  @ApiBearerAuth("KEY_AUTH")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  removeBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
