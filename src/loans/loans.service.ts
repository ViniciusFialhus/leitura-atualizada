import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  addDays,
  isFriday,
  isSaturday,
  isSunday,
  isThursday,
  isWednesday,
} from 'date-fns';
import { UsersService } from 'src/users/users.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansRepository } from './repository/loans-repository';
import { BooksService } from 'src/books/books.service';
import { LoanStatus, BookStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(
    private loansRepository: LoansRepository,
    private userService: UsersService,
    private bookService: BooksService,
  ) {}

  async createLoanRequest(createLoanDto: CreateLoanDto, email: string) {
    const userData = await this.userService.findByEmail(email);

    const bookData = await this.bookService.findOne(createLoanDto.bookId);
    const pickupDate = new Date();

    const loanRequest = {
      bookId: bookData.id,
      userId: userData.id,
      createdAt: new Date(),
      dueDate: pickupDate,
      pickupDate,
    };

    const wishlist = await this.userService.getWishlist(userData.id);
    let bookPresent = false;
    wishlist.forEach((book) => {
      if (book.id === bookData.id) {
        return (bookPresent = true);
      }
    });
    if (!bookPresent) {
      await this.userService.addToWishlist(userData.email, bookData.id);
    }

    const loan = await this.loansRepository.createLoan(loanRequest);
    return {
      bookId: loan.bookId,
      pickupDate: loan.pickupDate,
    };
  }

  async findAll() {
    return await this.loansRepository.findLoans();
  }

  async updateLoanStatus(id: string, updateLoanDto: UpdateLoanDto) {
    const loanExists = await this.loansRepository.findLoan(id);

    if (loanExists === null) {
      throw new HttpException(
        'Empréstimo não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const pickupDate = new Date();
    let _dueDate: Date = addDays(pickupDate, 3);
    if (
      isWednesday(pickupDate) ||
      isThursday(pickupDate) ||
      isFriday(pickupDate)
    ) {
      _dueDate = addDays(pickupDate, 5);
    }

    if (isSaturday(pickupDate) || isSunday(pickupDate)) {
      throw new HttpException(
        'Não fazemos empréstimos nos finais de semana',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateLoanDto.status === 'APPROVED') {
      const uploadData = {
        dueDate: _dueDate,
        pickupDate: pickupDate,
        status: LoanStatus.APPROVED,
      };
      try {
        const wishlist = await this.userService.getWishlist(loanExists.userId);
        wishlist.forEach(async (book) => {
          if (book.id === loanExists.bookId) {
            await this.userService.removeFromWishlist(
              loanExists.userId,
              loanExists.bookId,
            );
          }
        });
        await this.bookService.updateBook(loanExists.bookId, {
          status: BookStatus.LOANED,
        });
        return await this.loansRepository.updateLoan(id, uploadData);
      } catch (error) {
        throw new HttpException(
          'Erro ao atualizar o empréstimo',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      return await this.loansRepository.updateLoan(id, {
        status: LoanStatus.REJECTED,
      });
    }
  }
}
