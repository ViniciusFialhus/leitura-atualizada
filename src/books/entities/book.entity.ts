export interface Book {
  title: string;
  author: string;
  genre: string;
  description?: string;
  isbn: string;
  publishedAt?: Date;
  imgUrl?: string;
}
