import { IsUUID } from 'class-validator';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto implements Wishlist {
  @IsUUID()
  userid: string;

  @IsUUID()
  bookId: string;
}
