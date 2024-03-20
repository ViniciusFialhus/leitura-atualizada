import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "../dto/create-book.dto";
import { Book } from "../entities/book.entity";
import { HttpService } from "@nestjs/axios";
import { UpdateBookDto } from "../dto/update-book.dto";

@Injectable()
export class BooksRepository {
    constructor(private prisma: PrismaService, private httpSevice: HttpService) { }

    async createBook(createBookDto: CreateBookDto) {
        const { isbn } = createBookDto
        const bookInfo = await this.httpSevice.axiosRef.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)

        const newbook: Book = {
            title: bookInfo.data.items[0].volumeInfo.tittle,
            author: bookInfo.data.items[0].volumeInfo.authors[0],
            genre: bookInfo.data.items[0].volumeInfo.categories[0],
            description: bookInfo.data.items[0].searchInfo.textSnippet,
            isbn: bookInfo.data.items[0].volumeInfo.industryIdentifiers[0].identifier,
            publishedAt: bookInfo.data.items[0].volumeInfo.publishedDate,
            imageUrl: bookInfo.data.items[0].volumeInfo.readingModes.image
        }

        return this.prisma.book.create({
            data: newbook
        })
    }

    findAllBooks() {
        return this.prisma.book.findMany()
    }

    searchBook(q: Book) {
        if (!q.title) {
            return this.prisma.book.findMany({
                where: {
                    author: q.author
                }
            })
        }
        if (!q.author) {
            return this.prisma.book.findMany({
                where: {
                    title: q.title
                }
            })
        }

    }

    findOneBook(id: string) {
        return this.prisma.book.findUnique({
            where: {
                id
            }
        });
    }

    updateBook(id: string, updateBookDto: UpdateBookDto) {
        return this.prisma.book.update({
            where: { id },
            data: updateBookDto
        })
    }

    removeBook(id: string) {
        return this.prisma.book.delete({
            where: {
                id
            }
        })
    }
}