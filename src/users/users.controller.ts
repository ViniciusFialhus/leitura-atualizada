import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/profile')
  createProfileInfo(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/profile')
  findProfile() {
    return this.usersService.findAllUser();
  }

  @Put('/profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get('/wishlist')
  findWishlist() {
    return this.usersService.findAllWishlist();
  }

  @Post('/wishlist')
  createWishlistingBooks(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createWishlist(createUserDto);
  }

  @Delete('/wishlist/:id')
  removeWishlistingBooks(@Param('id') id: string) {
    return this.usersService.removeWishlistingBooks(id);
  }

  @Get('/wishlist/share')
  findShareLink() {
    return this.usersService.findShareLinkl();
  }
}
