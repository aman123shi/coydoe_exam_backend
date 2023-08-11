import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly otp: string;

  @IsNotEmpty()
  readonly password: string;
}
