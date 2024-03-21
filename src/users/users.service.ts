import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { WishlistRepository } from './repository/user-wishlist.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createWishlistDto } from '../dto/create-wishlist.dto';
import { updateWishlistDto } from '../dto/update-user.dto';
import { generateFromEmail } from 'unique-username-generator';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async findAllWishlist() {
    return this.WishlistRepository.findWishlist();
  }

  async createWishlist(
    createWishlistDto: CreateWishlistDto,
  ): Promise<CreateWishlistDto> {
    const existingUser = await prisma.wishlist.findUnique({
      where: {
        id: CreateWishlistDto.id,
      },
    });
    if (existingUser) {
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    }
    return await prisma.wishlist.createWishlistingBooks({
      data: createWishlistDto,
    });
  }

  async removeWishlistingBooks(id: string) {
    return this.WishlistRepository.removeWishlistingBooks(id);
  }

  async findShareLink(id: string) {
    return this.WishlistRepository.findShareLink(id);
  }
}
