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
import { Cookies } from 'src/auth/utils/cookies.decorator';
import { AuthService } from 'src/auth/auth.service';
import { AuthenticatedUserGuard } from 'src/auth/guards/authenticated-user.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin.guard';

@Controller('loan-requests')
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
    private readonly authService: AuthService,
  ) {}

  @Post()
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

  @Get()
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.loansService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthenticatedUserGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.updateLoanStatus(id, updateLoanDto);
  }
}
