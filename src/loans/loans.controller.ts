import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorSwagger } from 'src/helpers/swagger/ErrorSwagger';
import { ResponseCreateLoan } from './swagger/ResponseCreaLoan';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { LoansService } from './loans.service';
import { Cookies } from 'src/auth/utils/cookies.decorator';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin.guard';

@Controller('loan-requests')
@ApiTags("loans")
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cria um novo empréstimo" })
  @ApiResponse({ status: 202, description: "Empréstimo criado com sucesso", type: ResponseCreateLoan })
  @ApiResponse({ status: 404, description: "Usuário não encontrado", type: ErrorSwagger })
  @ApiResponse({ status: 404, description: "Livro não encontrado", type: ErrorSwagger })
  @ApiBearerAuth("KEY_AUTH")
  @UseGuards(AuthenticatedUserGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async create(
    @Body() createLoanDto: CreateLoanDto,
    @Headers('Authorization') jwtToken: string,
    @Cookies('access_token') googleToken: string,
  ) {
    if (jwtToken) {
      const tokenData = await this.authService.decryptToken(jwtToken);
      return this.loansService.createLoanRequest(
        createLoanDto,
        tokenData.email,
      );
    } else if (googleToken) {
      const userEmail = await this.authService.retrieveGoogleEmail(googleToken);
      return this.loansService.createLoanRequest(createLoanDto, userEmail);
    }
  }

  @Get('all')
  @ApiOperation({ summary: "Lista os empréstimos cadastrados no sistema" })
  @ApiResponse({ status: 200, description: "Lista de empréstimos retornada com sucesso", type: Loan, isArray: true })
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("KEY_AUTH")
  findAll() {
    return this.loansService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("KEY_AUTH")
  @ApiOperation({ summary: "Atualiza um empréstimo" })
  @ApiResponse({ status: 200, description: "Empréstimo atualizado com sucesso", type: Loan })
  @ApiResponse({ status: 404, description: "Empréstimo não encontrado", type: ErrorSwagger })
  @ApiResponse({ status: 400, description: "Erro ao atualizar o empréstimo", type: ErrorSwagger })
  @ApiParam({ name: 'id', description: "ID do empréstimo a ser atualizado" })
  @ApiBearerAuth("KEY_AUTH")
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.updateLoanStatus(id, updateLoanDto);
  }
}
