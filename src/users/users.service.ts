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
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wishlistRepository: WishlistRepository,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findUnique(email);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    }
    createUserDto.username = generateFromEmail(createUserDto.email);

    return await this.userRepository.createUser(createUserDto);
  }

  async findAllUsers() {
    return this.userRepository.findAllUser();
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findByEmail(email);
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.updateUser(existingUser.id, updateUserDto);
  }

  // async findUserWishlist(userId: string, createUserDto: CreateUserDto) {
  //   const existingUser = await this.findByEmail(createUserDto.email);

  //   if (!existingUser) {
  //     throw new HttpException('Usuario não existente', HttpStatus.BAD_REQUEST);
  //   }

  //   return await this.wishlistRepository.findWishUser(userId);
  // }

  // async createWishlist(createWishlistDto: CreateWishlistDto) {
  //   return await this.wishlistRepository.createWishlistingBooks(createWishlistDto)
  // }

  // async removeWishlistingBooks(id: string) {
  //   const userWishlist = this.wishlistRepository.findWishlist(id);

  //   if (!userWishlist) {
  //     throw new HttpException(
  //       'Esse item não consta nessa lista',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return this.wishlistRepository.removeWishlistingBooks(id);
  // }

  // async findShareLink(id: string) {
  //   return this.wishlistRepository.findShareLink(id);
  // }
}
