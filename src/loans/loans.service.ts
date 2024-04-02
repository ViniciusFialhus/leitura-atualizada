import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays, isSaturday, isSunday } from 'date-fns';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansRepository } from './repository/loans-repository';

@Injectable()
export class LoansService {
  constructor(private loansRepository: LoansRepository, private authService: AuthService, private userService: UsersService) { }

  async create(createLoanDto: CreateLoanDto, req: Request) {
    const isBookExist = await this.loansRepository.findBook(createLoanDto.bookId)
    const data = await this.authService.decryptToken(req)
    const userExists = await this.userService.findByEmail(data.emil)
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
      bookId: loan.bookId,
      pickupDate: loan.pickupDate
    }
  }

  async findAll(req: Request) {
    const data = await this.authService.decryptToken(req)
    const user = await this.userService.findByEmail(data.email)

    if (!user.isAdm) {
      throw new HttpException("Rota somente para administradores", HttpStatus.FORBIDDEN)
    }

    return await this.loansRepository.findLoans()
  }

  async update(id: string, updateLoanDto: UpdateLoanDto, req: Request) {
    const data = await this.authService.decryptToken(req)
    const user = await this.userService.findByEmail(data.email)

    if (!user.isAdm) {
      throw new HttpException("Rota somente para administradores", HttpStatus.FORBIDDEN)
    }

    const loanExists = await this.loansRepository.findLoan(id)

    if (!loanExists) {
      throw new HttpException("Empréstimo não encontrado", HttpStatus.NOT_FOUND)
    }

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
