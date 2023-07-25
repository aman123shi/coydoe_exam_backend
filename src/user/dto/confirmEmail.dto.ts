import { IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly otp: string;

  @IsNotEmpty()
  readonly password: string;
}
