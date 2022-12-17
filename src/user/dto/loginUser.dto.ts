import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly password: string;
}
