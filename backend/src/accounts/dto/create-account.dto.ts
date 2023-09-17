import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

// export enum AccountType {
//   SAVING = 'SAVING',
// }

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
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

  @ApiPropertyOptional()
  user_id?: number;

  @ApiPropertyOptional()
  note?: string;
}

export class CreateWithdrawTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional()
  user_id?: number;

  @ApiPropertyOptional()
  note?: string;
}

export class CreateInterestTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional()
  user_id?: number;

  @ApiPropertyOptional()
  note?: string;
}

export class RollbackTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  account_id: number;
}
