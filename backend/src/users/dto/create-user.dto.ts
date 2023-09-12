import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  citizenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  surname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  isAdmin: boolean;
}
