import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoansService } from './loans.service';

@Controller('loan-requests')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }
}
