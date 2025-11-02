import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { Transform } from 'class-transformer';
import { TransactionAction } from '@prisma/client';
import { IsBoolean } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class UpdateInterestDto {
  @ApiPropertyOptional({ required: true, default: true })
  @IsBoolean()
  isDry: boolean;
}

export class UpdateAccountBalanceDto {
  @ApiPropertyOptional({ required: false, default: true })
  @IsBoolean()
  isDry?: boolean;
}

export class UpdateTransactionDto {
  @ApiProperty({ required: true })
  id: number;
  
  @ApiProperty({ required: true })
  accountId: number;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  previousBalance?: number;

  @ApiPropertyOptional()
  newBalance?: number;

  @ApiPropertyOptional()
  createAt?: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty({ required: true, enum: TransactionAction })
  action: TransactionAction;
}
