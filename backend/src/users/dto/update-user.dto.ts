import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  nickName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  citizenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  brithday?: string;

  @ApiPropertyOptional()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  surname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  tel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  role?: Role;
}
