import { IsNotEmpty } from 'class-validator';

export class UserLoginByEmailDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
