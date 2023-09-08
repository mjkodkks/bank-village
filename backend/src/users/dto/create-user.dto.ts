import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  password?: string;

  citizenId?: string;

  @IsNotEmpty()
  isAdmin: boolean;
}
