import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansRepository } from './repository/loans-repository';

@Injectable()
export class LoansService {
  constructor(private loansRepository: LoansRepository) { }

  async create(createLoanDto: CreateLoanDto) {
    const isBookExist = await this.loansRepository.findBook(createLoanDto.bookId as string)
    const userExists = await this.loansRepository.findUser(createLoanDto.userId as string)

    if (!isBookExist) {
      throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!userExists) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }
    const loanCreated = {
      bookId: isBookExist.id,
      userId: userExists.id,
      createdAt: new Date(),
      pickupDate: new Date(),
      dueTime: addDays(new Date, 3)
    }
    const loan = await this.loansRepository.createLoan(loanCreated)

    return {
      message: "Emprestimo solicitado com sucesso",
      Loan: loan
    }
  }

  async findAll() {
    return await this.loansRepository.findLoans()
  }

  findOne(id: number) {
    return `This action returns a #${id} loan`;
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
