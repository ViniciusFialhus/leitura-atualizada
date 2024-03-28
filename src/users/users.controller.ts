import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/profile')
  createProfileInfo(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/profile')
  findProfile() {
    return this.usersService.findAllUsers();
  }

  @Patch('/profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get('/wishlist/:id')
  findWishlist(@Param('id') id: string) {
    return this.usersService.findUserWishlist(id);
  }

  // @Post('/wishlist')
  // createWishlistingBooks(@Body() CreateWishlistDto: CreateWishlistDto) {
  //   return this.usersService.createWishlist(CreateWishlistDto);
  // }

  @Delete('/wishlist/:id')
  removeWishlistingBooks(@Param('id') id: string) {
    return this.usersService.removeWishlistingBooks(id);
  }

  // @Get('/wishlist/share/:id')
  // findShareLink(@Param('id') id: string) {
  //   return this.usersService.findShareLink(id)
  // }
}
