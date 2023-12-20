import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStatementDto {
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
