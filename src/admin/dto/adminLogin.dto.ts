import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
