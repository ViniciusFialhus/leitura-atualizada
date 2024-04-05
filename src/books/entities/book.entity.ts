import { BookStatus } from '@prisma/client';

export interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  isbn: string;
  publishedAt?: Date;
  imgUrl?: string;
  status?: BookStatus;
}
