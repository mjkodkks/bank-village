import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { Transform } from 'class-transformer';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class UpdateInterestDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  isDry: boolean;
}
