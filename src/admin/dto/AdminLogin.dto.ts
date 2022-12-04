import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly password: string;
}
