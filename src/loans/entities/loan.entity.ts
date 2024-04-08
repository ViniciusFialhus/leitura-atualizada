import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '@prisma/client';

export class Loan {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  pickupDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  status: LoanStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
