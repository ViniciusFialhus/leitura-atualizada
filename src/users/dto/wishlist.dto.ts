import { IsUUID } from 'class-validator';
import { Wishlist } from '../entities/wishlist.entity';

export class WishlistDto implements Wishlist {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}
