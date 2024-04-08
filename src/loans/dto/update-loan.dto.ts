import { LoanStatus } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateLoanDto {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsString({ message: 'Must be a String' })
  status: LoanStatus;
}