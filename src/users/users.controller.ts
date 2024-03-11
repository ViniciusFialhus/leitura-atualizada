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
    return this.usersService.create(createUserDto);
  }

  @Get('/profile')
  findProfile() {
    return this.usersService.findAll();
  }

  @Put('/profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('/wishlist')
  findWishlist() {
    return this.usersService.findAll();
  }

  @Post('/wishlist')
  createWishlistingBooks(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete('/wishlist/:id')
  removeWishlistingBooks(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/wishlist/share')
  findShareLink() {
    return this.usersService.findAll();
  }
}
