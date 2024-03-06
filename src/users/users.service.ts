import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishlistRepository } from './repository/user-wishlist.repository';

@Injectable()
export class UsersService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    if (!id) throw new HttpException('erro', HttpStatus.NOT_FOUND);

    this.wishlistRepository.remove(id);

    return;
  }
}
