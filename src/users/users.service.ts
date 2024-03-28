import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { generateFromEmail } from 'unique-username-generator';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishlistRepository } from './repository/user-wishlist.repository';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private wishlistRepository: WishlistRepository) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findUnique(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    }
    createUserDto.username = generateFromEmail(createUserDto.email);

    return await this.userRepository.createUser(createUserDto);
  }

  async findAllUsers() {
    return this.userRepository.findAllUser();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findUnique(
      updateUserDto.email,
    );
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async findUserWishlist(id: string) {
    return await this.wishlistRepository.findWishlist(id);
  }

  // async createWishlist(createWishlistDto: CreateWishlistDto) {
  //   return await this.wishlistRepository.createWishlistingBooks(createWishlistDto)
  // }

  async removeWishlistingBooks(id: string) {
    return this.wishlistRepository.removeWishlistingBooks(id);
  }

  // async findShareLink(id: string) {
  //   return this.wishlistRepository.findShareLink(id);
  // }
}
