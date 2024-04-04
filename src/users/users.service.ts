import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book, User, Wishlist } from '@prisma/client';
import { generateFromEmail } from 'unique-username-generator';
import { CreateUserDto } from './dto/create-user.dto';
import { WishlistRepository } from './repository/user-wishlist.repository';
import { UserRepository } from './repository/user.repository';
import { HttpService } from '@nestjs/axios';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wishlistRepository: WishlistRepository,
    private readonly httpService: HttpService,
    private readonly booksService: BooksService,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findUnique(email);
  }

  async generateRandomCode(): Promise<string> {
    const randomCodeRequest = await this.httpService.axiosRef.post(
      'https://api.voucherjet.com/api/v1/p/generator',
      {
        count: 1,
        pattern: '####################',
        characters:
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      },
    );
    return randomCodeRequest.data.codes[0];
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    }
    createUserDto.username = generateFromEmail(createUserDto.email);
    createUserDto.shareableHash = '####################';
    createUserDto.refreshToken = null;

    return await this.userRepository.createUser(createUserDto);
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findByEmail(email);
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.updateUser(existingUser.id, updateUserDto);
  }

  async getWishlist(userEmail: string) {
    const existingUser = await this.findByEmail(userEmail);
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    return await this.wishlistRepository.returnWishlist(existingUser.id);
  }

  async addToWishlist(userEmail: string, bookId: string): Promise<Wishlist> {
    const existingUser = await this.findByEmail(userEmail);
    await this.booksService.findOne(bookId);
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    return await this.wishlistRepository.addToWishlist({
      userId: existingUser.id,
      bookId,
    });
  }

  async removeFromWishlist(userEmail: string, bookId: string) {
    const existingUser = await this.findByEmail(userEmail);
    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    const bookListed = await this.wishlistRepository.findBookWishlisted({
      userId: existingUser.id,
      bookId,
    });
    if (bookListed === null) {
      throw new HttpException(
        'Esse item não consta nessa lista',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.wishlistRepository.removeBookFromWishlist({
      userId: existingUser.id,
      bookId,
    });
  }

  async generateShareLink(userEmail: string): Promise<string> {
    const hash: string = await this.generateRandomCode();
    await this.updateUser(userEmail, { shareableHash: hash });
    return `http://localhost:3000/${hash}`;
  }

  async accessPublicWishlist(hash: string): Promise<Book[]> {
    const user = await this.userRepository.findUserHash(hash);
    if (!user) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.wishlistRepository.returnWishlist(user.id);
  }
}
