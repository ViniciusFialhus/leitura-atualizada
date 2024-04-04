import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    const protectedUserData: CreateUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    return await this.prisma.user.create({
      data: protectedUserData,
    });
  }

  async findUnique(uniqueEmail: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: uniqueEmail,
      },
    });
  }

  async findUserHash(wishlistHash: string) {
    return await this.prisma.user.findFirst({
      where: { shareableHash: wishlistHash },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const protectedUserData = {
        ...updateUserDto,
        password: await bcrypt.hash(updateUserDto.password, 10),
      };
      return await this.prisma.user.update({
        where: { id },
        data: protectedUserData,
      });
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
