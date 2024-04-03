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
} from '@nestjs/common';

import { Request } from 'express';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansService } from './loans.service';

@Controller('loan-requests')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createLoanDto: CreateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.create(createLoanDto, userToken);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.loansService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @Headers('Authorization') userToken: string,
  ) {
    return this.loansService.update(id, updateLoanDto, userToken);
  }
}
