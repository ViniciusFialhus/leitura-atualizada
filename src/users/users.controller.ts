import {
  Body,
  Headers,
  Controller,
  // Delete,
  Get,
  // Param,
  Put,
  Inject,
  forwardRef,
  Post,
  UseGuards,
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

  // @Get('/wishlist/:id')
  // findWishlist(@Param('id') userId: string, createUserDto: CreateUserDto) {
  //   return this.usersService.findUserWishlist(userId, createUserDto);
  // }

  // @Post('/wishlist')
  // createWishlistingBooks(@Body() CreateWishlistDto: CreateWishlistDto) {
  //   return this.usersService.createWishlist(CreateWishlistDto);
  // }

  // @Delete('/wishlist/:id')
  // removeWishlistingBooks(@Param('id') id: string) {
  //   return this.usersService.removeWishlistingBooks(id);
  // }

  // @Get('/wishlist/share/:id')
  // findShareLink(@Param('id') id: string) {
  //   return this.usersService.findShareLink(id)
  // }
}
