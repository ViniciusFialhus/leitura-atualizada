import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays, isFriday, isSaturday, isSunday, isThursday, isWednesday } from 'date-fns';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansRepository } from './repository/loans-repository';

@Injectable()
export class LoansService {
  constructor(
    private loansRepository: LoansRepository,
    private authService: AuthService,
    private userService: UsersService,
  ) { }

  async create(createLoanDto: CreateLoanDto, token: string) {
    const isBookExist = await this.loansRepository.findBook(
      createLoanDto.bookId,
    );
    const data = await this.authService.decryptToken(token);
    const userExists = await this.userService.findByEmail(data.email);
    const pickupDate = new Date()
    let _dueDate: Date = addDays(pickupDate, 3)

    if (!isBookExist) {
      throw new HttpException('Livro não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!userExists) {
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    if (isWednesday(pickupDate) || isThursday(pickupDate) || isFriday(pickupDate)) {
      _dueDate = addDays(pickupDate, 5);
    }

    if (isSaturday(pickupDate) || isSunday(pickupDate)) {
      throw new HttpException('não fazemos emprestimos nos finais de semana', HttpStatus.BAD_REQUEST)
    }

    const loanCreated = {
      bookId: isBookExist.id,
      userId: userExists.id,
      createdAt: new Date(),
      pickupDate,
      dueDate: _dueDate,
    };

    const loan = await this.loansRepository.createLoan(loanCreated);

    return {
      bookId: loan.bookId,
      pickupDate: loan.pickupDate,
    };
  }

  async findAll() {
    // const user = await this.userService.findByEmail(data.email);

    // if (!user.isAdm) {
    //   throw new HttpException(
    //     'Rota somente para administradores',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    return await this.loansRepository.findLoans();
  }

  async update(id: string, updateLoanDto: UpdateLoanDto, token: string) {
    const data = await this.authService.decryptToken(token);
    const user = await this.userService.findByEmail(data.email);

    if (!user.isAdm) {
      throw new HttpException(
        'Rota somente para administradores',
        HttpStatus.FORBIDDEN,
      );
    }

    const loanExists = await this.loansRepository.findLoan(id);

    if (!loanExists) {
      throw new HttpException(
        'Empréstimo não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const loanUpdated = await this.loansRepository.updateLoan(
      id,
      updateLoanDto,
    );

    if (!loanUpdated) {
      throw new HttpException(
        'Erro ao atualizar o empréstimo',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Empréstimo atualizado com sucesso',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
