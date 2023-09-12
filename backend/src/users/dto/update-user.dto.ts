import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  nickName?: string;

  @ApiPropertyOptional()
  citizenId?: string;

  @ApiPropertyOptional()
  brithday?: string;

  @ApiPropertyOptional()
  firstname?: string;

  @ApiPropertyOptional()
  surname?: string;
}
