import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';

import { Request } from 'express';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansService } from './loans.service';

@Controller('loan-requests')
export class LoansController {
  constructor(private readonly loansService: LoansService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: Request) {
    return this.loansService.findAll(req);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto, @Req() req: Request) {
    return this.loansService.update(id, updateLoanDto, req);
  }
}
