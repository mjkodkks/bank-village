import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}

export class CreateWithdrawTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
