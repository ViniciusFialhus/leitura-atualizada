import { LoanStatus } from "@prisma/client";

export class UpdateLoanDto {
  status: LoanStatus
}
