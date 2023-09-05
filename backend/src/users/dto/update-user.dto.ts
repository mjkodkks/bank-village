import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  address?: string;

  @ApiProperty()
  nickName?: string;

  @ApiProperty()
  citizenId?: string;

  @ApiProperty()
  brithday?: string;

  @ApiProperty()
  firstname?: string;

  @ApiProperty()
  surname?: string;
}
