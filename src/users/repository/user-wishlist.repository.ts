import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { WishlistDto } from '../dto/wishlist.dto';

@Injectable()
export class WishlistRepository {
  constructor(private prisma: PrismaService) {}

  async returnWishlist(userId: string) {
    const wishlistedEntries = await this.prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: { book: true },
    });

    const wishlistedBooks = wishlistedEntries.map(
      (bookEntry) => bookEntry.book,
    );

    return wishlistedBooks;
  }

  async addToWishlist(createWishlistDto: WishlistDto) {
    createWishlistDto;
    return await this.prisma.wishlist.create({
      data: createWishlistDto,
    });
  }

  async removeBookFromWishlist(removeFromWishlistDto: WishlistDto) {
    return await this.prisma.wishlist.deleteMany({
      where: removeFromWishlistDto,
    });
  }

  async findBookWishlisted(bookListed: WishlistDto) {
    return await this.prisma.wishlist.findFirst({ where: bookListed });
  }
}
