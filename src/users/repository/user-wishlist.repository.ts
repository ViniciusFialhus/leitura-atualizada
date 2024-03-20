import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateWishlistDto } from '../dto/create-wishlist.dto';
import { UpdateWishlistDto } from '../dto/update-user.dto';

@Injectable()
export class WishlistRepository {
  constructor(private prisma: PrismaService) {}
  async findWishlist() {
    return await this.prisma.wishlist.findMany();
  }

  async createWishlistingBooks(createWishlistDto: CreateWishlistDto) {
    return await this.prisma.wishlist.create({
      data: createWishlistDto,
    });
  }

  async removeWishlistingBooks(id: string) {
    return await this.prisma.wishlist.delete(id);
  }

  async findShareLink(id: string) {
    return await this.prisma.wishlist.findUnique({
      where: { id: id },
      select: { shareLink: true },
    });
  }
}
