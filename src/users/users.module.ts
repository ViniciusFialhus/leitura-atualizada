import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { WishlistRepository } from './repository/user-wishlist.repository';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService, WishlistRepository],
})
export class UsersModule {}
