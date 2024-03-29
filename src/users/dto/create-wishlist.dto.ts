import { IsOptional, IsUUID } from 'class-validator';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto implements Wishlist {
  @IsOptional()
  id: string

  @IsUUID()
  userid: string;

  @IsUUID()
  bookId: string;

  @IsOptional()
  book: string

  @IsOptional()
  user: string
}
