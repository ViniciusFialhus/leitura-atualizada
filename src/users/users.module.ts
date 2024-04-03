import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { WishlistRepository } from './repository/user-wishlist.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService, WishlistRepository],
})
export class UsersModule {}
