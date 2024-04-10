import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Book, User, Wishlist } from '@prisma/client';
import { generateFromEmail } from 'unique-username-generator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    const existingUser = await this.userRepository.findUnique(email);

    if (!existingUser) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    return existingUser;
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
    try {
      await this.findByEmail(createUserDto.email);
      throw new HttpException('Usuario já existente', HttpStatus.BAD_REQUEST);
    } catch (error) {
      if (!createUserDto.username) {
        createUserDto.username = generateFromEmail(createUserDto.email);
      }
      createUserDto.shareableHash = '####################';
      createUserDto.refreshToken = null;
      createUserDto.isAdm = false;

      return await this.userRepository.createUser(createUserDto);
    }
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.findByEmail(email);
    try {
      return await this.userRepository.updateUser(user.id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        'Apenas campos contidos no tipo User podem estar inseridos no Body da requisição',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getWishlist(userData: string) {
    if (userData.includes('@')) {
      const user = await this.findByEmail(userData);
      return await this.wishlistRepository.returnWishlist(user.id);
    } else {
      return await this.wishlistRepository.returnWishlist(userData);
    }
  }

  async addToWishlist(userEmail: string, bookId: string): Promise<Wishlist> {
    const user = await this.findByEmail(userEmail);
    await this.booksService.findOne(bookId);

    return await this.wishlistRepository.addToWishlist({
      userId: user.id,
      bookId,
    });
  }

  async removeFromWishlist(userData: string, bookId: string) {
    if (userData.includes('@')) {
      const user = await this.findByEmail(userData);
      const bookListed = await this.wishlistRepository.findBookWishlisted({
        userId: user.id,
        bookId,
      });
      if (bookListed === null) {
        throw new HttpException(
          'Esse item não consta nessa lista',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.wishlistRepository.removeBookFromWishlist({
        userId: user.id,
        bookId,
      });
    }
    const bookListed = await this.wishlistRepository.findBookWishlisted({
      userId: userData,
      bookId,
    });
    if (bookListed === null) {
      throw new HttpException(
        'Esse item não consta nessa lista',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.wishlistRepository.removeBookFromWishlist({
      userId: userData,
      bookId,
    });
  }

  async generateShareLink(userEmail: string): Promise<string> {
    const hash: string = await this.generateRandomCode();
    await this.updateUser(userEmail, { shareableHash: hash });
    return `${process.env.BASE_URL}/${hash}`;
  }

  async accessPublicWishlist(hash: string): Promise<Book[]> {
    const user = await this.userRepository.findUserHash(hash);
    return await this.wishlistRepository.returnWishlist(user.id);
  }
}
