import { ApiProperty } from "@nestjs/swagger";
import { LoanStatus } from "@prisma/client";

export class UpdateLoanDto {
  @ApiProperty()
  status: LoanStatus
}
