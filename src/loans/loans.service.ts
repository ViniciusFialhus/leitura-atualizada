import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays, isSaturday, isSunday } from 'date-fns';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansRepository } from './repository/loans-repository';

@Injectable()
export class LoansService {
  constructor(private loansRepository: LoansRepository) { }

  async create(createLoanDto: CreateLoanDto) {
    const isBookExist = await this.loansRepository.findBook(createLoanDto.bookId as string)
    const userExists = await this.loansRepository.findUser(createLoanDto.userId as string)
    let _dueDate: Date

    if (!isBookExist) {
      throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!userExists) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    if (isSaturday(addDays(new Date(), 3))) {
      _dueDate = addDays(new Date(), 5)
    }

    if (isSunday(addDays(new Date(), 3))) {
      _dueDate = addDays(new Date(), 4)
    }

    const loanCreated = {
      bookId: isBookExist.id,
      userId: userExists.id,
      createdAt: new Date(),
      pickupDate: new Date(),
      dueDate: _dueDate
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

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const loanUpdated = await this.loansRepository.updateLoan(id, updateLoanDto)

    if (!loanUpdated) {
      throw new HttpException("Erro ao atualizar o empréstimo", HttpStatus.BAD_REQUEST)
    }

    return {
      message: "Empréstimo atualizado com sucesso"
    }
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
