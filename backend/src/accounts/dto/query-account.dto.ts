import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryIntersetDto {
  @ApiProperty()
  year?: number;
}