import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AccountType {
  SAVING = 'SAVING',
}

export class CreateAccountDto {
  @IsNotEmpty()
  user_id: number;

  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;
}

export class CreateDepositTransactionDto {
  @IsNotEmpty()
  account_id: number;

  @IsNotEmpty()
  balance: number;
}

export class CreateWithdrawTransactionDto {
  @IsNotEmpty()
  account_id: number;

  @IsNotEmpty()
  balance: number;
}
