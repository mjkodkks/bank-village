import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AccountType {
  SAVING = 'SAVING',
}

export class CreateAccountDto {
  @IsNotEmpty()
  user_id: number;

  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;
}
