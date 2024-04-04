import {
  Body,
  Headers,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Inject,
  forwardRef,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { Cookies } from 'src/auth/utils/cookies.decorator';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('/profile')
  async createProfileInfo(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('/profile')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthenticatedUserGuard)
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
  async publicWishlistAccess(@Param(':hash') hash: string) {
    return await this.usersService.accessPublicWishlist(hash);
  }
}
