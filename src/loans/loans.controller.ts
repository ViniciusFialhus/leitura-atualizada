import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorSwagger } from 'src/helpers/swagger/ErrorSwagger';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { LoansService } from './loans.service';
import { ResponseCreateLoan } from './swagger/ResponseCreaLoan';

@Controller('loan-requests')
@ApiTags("loans")
export class LoansController {
  constructor(private readonly loansService: LoansService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cria um novo empréstimo" })
  @ApiResponse({ status: 200, description: "Empréstimo criado com sucesso", type: ResponseCreateLoan })
  @ApiResponse({ status: 404, description: "Usuário não encontrado", type: ErrorSwagger })
  @ApiResponse({ status: 404, description: "Livro não encontrado", type: ErrorSwagger })
  @ApiBearerAuth("KEY_AUTH")
  create(
    @Body() createLoanDto: CreateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.create(createLoanDto, userToken);
  }

  @Get()
  @ApiOperation({ summary: "Lista os empréstimos cadastrados no sistema" })
  @ApiResponse({ status: 200, description: "Lista de empréstimos retornada com sucesso", type: Loan, isArray: true })
  @ApiBearerAuth("KEY_AUTH")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("KEY_AUTH")
  findAll() {
    return this.loansService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("KEY_AUTH")
  @ApiOperation({ summary: "Atualiza um empréstimo" })
  @ApiResponse({ status: 200, description: "Empréstimo atualizado com sucesso", type: Loan })
  @ApiResponse({ status: 404, description: "Empréstimo não encontrado", type: ErrorSwagger })
  @ApiResponse({ status: 400, description: "Erro ao atualizar o empréstimo", type: ErrorSwagger })
  @ApiParam({ name: 'id', description: "ID do empréstimo a ser atualizado" })
  @ApiBearerAuth("KEY_AUTH")
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.update(id, updateLoanDto, userToken);
  }
}
