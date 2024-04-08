import { IsNotEmpty, IsUUID } from 'class-validator';
import { Loan } from '../entities/loan.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto implements Loan {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;

  @IsNotEmpty({ message: 'Can`t be empty' })
  @ApiProperty()
  @IsUUID('all', { message: 'Must be a valid UUID' })
  userId: string;
}