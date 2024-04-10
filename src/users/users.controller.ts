import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Inject,
  Post,
  Put,
  UseGuards,
  forwardRef,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { Cookies } from 'src/auth/utils/cookies.decorator';
import { ResponseCreateBook } from 'src/books/swagger/ResponseCreateBook';
import { ErrorSwagger } from 'src/helpers/swagger/ErrorSwagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BodyCreateWishList } from './swagger/BodyCreateWishList';
import { ResponseCreateuser } from './swagger/ResponseCreateUser';
import { ResponseUpdateUser } from './swagger/ResponseUpdateUser';
import { ResponseWishList } from './swagger/ResponseWishList';
import { UsersService } from './users.service';

@Controller()
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('/profile')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: ResponseCreateuser,
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário já cadastrado',
    type: ErrorSwagger,
  })
  @ApiBody({ type: CreateUserDto, description: 'Dados para criar o usuário' })
  @HttpCode(HttpStatus.CREATED)
  async createProfileInfo(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Retorna os dados do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Dados retornados com sucesso',
    type: ResponseCreateuser,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorSwagger,
  })
  @ApiBearerAuth('KEY_AUTH')
  @UseGuards(AuthenticatedUserGuard)
  async findProfile(
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.findByEmail(tokenData.email);
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.findByEmail(userEmail);
    }
  }

  @Put('/profile')
  @UseGuards(AuthenticatedUserGuard)
  @ApiOperation({ summary: 'Atualiza os dados do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: ResponseCreateuser,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: ErrorSwagger,
  })
  @ApiBody({
    type: ResponseUpdateUser,
    description: 'Dados para atualizar o usuário',
  })
  @ApiBearerAuth('KEY_AUTH')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.updateUser(tokenData.email, updateUserDto);
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.updateUser(userEmail, updateUserDto);
    }
  }

  @Get('/wishlist')
  @ApiOperation({ summary: 'Encontra uma lista de desejos pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desejos encontrado com sucesso',
    type: ResponseCreateBook,
    isArray: true,
  })
  @ApiParam({ name: 'id', description: 'ID da lista de desejos a ser buscada' })
  @ApiBearerAuth('KEY_AUTH')
  @UseGuards(AuthenticatedUserGuard)
  async findWishlist(
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.getWishlist(tokenData.email);
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.getWishlist(userEmail);
    }
  }

  @Post('/wishlist')
  @UseGuards(AuthenticatedUserGuard)
  @ApiOperation({ summary: 'Cria uma nova lista de desejos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desejos criada com sucesso',
    type: ResponseWishList,
  })
  @ApiResponse({
    status: 404,
    description: 'Livro não encontrado',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorSwagger,
  })
  @ApiBody({ type: BodyCreateWishList, description: 'ID do livro' })
  @ApiBearerAuth('KEY_AUTH')
  @HttpCode(HttpStatus.CREATED)
  async addToUserWishlist(
    @Body('bookId') bookId: string,
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.addToWishlist(tokenData.email, bookId);
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.addToWishlist(userEmail, bookId);
    }
  }

  @Delete('/wishlist/:bookId')
  @UseGuards(AuthenticatedUserGuard)
  @ApiOperation({ summary: 'Remove um livro da lista de desejos' })
  @ApiResponse({ status: 204, description: 'Livro removido com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Livro não encontrado',
    type: ErrorSwagger,
  })
  @ApiParam({ name: 'id', description: 'ID do livro a ser removido' })
  @ApiBearerAuth('KEY_AUTH')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromWishlist(
    @Param('bookId') bookId: string,
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.removeFromWishlist(
        tokenData.email,
        bookId,
      );
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.removeFromWishlist(userEmail, bookId);
    }
  }

  @Get('/wishlist/share')
  @UseGuards(AuthenticatedUserGuard)
  @ApiOperation({
    summary: 'Retorna um link compartilhavel da lista de desejos',
  })
  @ApiResponse({
    status: 201,
    description: 'Link criado com sucesso',
    schema: { type: 'string' },
  })
  @ApiBearerAuth('KEY_AUTH')
  async shareWishlist(
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return await this.usersService.generateShareLink(tokenData.email);
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return await this.usersService.generateShareLink(userEmail);
    }
  }

  @Get('/:hash')
  @ApiOperation({ summary: 'Retorna a lista de desejo' })
  @ApiResponse({
    status: 200,
    description: 'Operação bem sucedida',
    type: ResponseCreateBook,
    isArray: true,
  })
  @ApiParam({ name: ':hash', description: 'hash da lista de desejos' })
  @ApiBearerAuth('KEY_AUTH')
  publicWishlistAccess(@Param(':hash') hash: string) {
    return this.usersService.accessPublicWishlist(hash);
  }
}
