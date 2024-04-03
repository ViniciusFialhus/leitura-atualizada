import {
  Body,
  Headers,
  Controller,
  // Delete,
  Get,
  // Param,
  Patch,
  Inject,
  forwardRef,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('/profile')
  createProfileInfo(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/profile')
  findProfile() {
    return this.usersService.findAllUsers();
  }

  @Patch('/profile')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') userToken: string,
  ) {
    const userData = await this.authService.decryptToken(userToken);

    return this.usersService.updateUser(userData.email, updateUserDto);
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
