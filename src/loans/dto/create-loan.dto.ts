import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty()
  @IsUUID('all', { message: 'Must be a valid UUID' })
  bookId: string;

  @ApiProperty()
  userId: string
}
