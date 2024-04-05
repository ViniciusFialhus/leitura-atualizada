import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';

import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansService } from './loans.service';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin.guard';

@Controller('loan-requests')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @UseGuards(AuthenticatedUserGuard)
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createLoanDto: CreateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.create(createLoanDto, userToken);
  }

  @Get()
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.loansService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.update(id, updateLoanDto, userToken);
  }
}
