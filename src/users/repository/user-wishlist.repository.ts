import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { WishlistDto } from '../dto/wishlist.dto';

@Injectable()
export class WishlistRepository {
  constructor(private prisma: PrismaService) { }

  async findWishUser(userId: string) {
    return await this.prisma.wishlist.findMany({
      where: {
        userId
      }
    })
  }

  async createWishlistingBooks(createWishlist: WishlistDto) {
    return { wishlist: createWishlist }
  }

  async removeWishlistingBooks(id: string) {
    return { wishlist: id }
  }

  async findWishlist(id: string) {
    return { wishlist: id }
  }

  async findShareLink(id: string) {
    return { wishlist: id }
  }
}
