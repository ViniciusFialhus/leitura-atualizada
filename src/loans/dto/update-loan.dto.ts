import { LoanStatus } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLoanDto {
  @IsNotEmpty({ message: 'Can`t be empty' })
  @IsString({ message: 'Must be a String' })
  status: LoanStatus
}
