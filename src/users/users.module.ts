import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { WishlistRepository } from './repository/user-wishlist.repository';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { BooksModule } from 'src/books/books.module';

@Module({
  exports: [UsersService],
  imports: [
    BooksModule,
    forwardRef(() => AuthModule),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService, WishlistRepository],
})
export class UsersModule {}
