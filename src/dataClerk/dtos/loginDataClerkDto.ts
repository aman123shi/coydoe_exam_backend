import { IsNotEmpty } from 'class-validator';

export class LoginDataClerkDTO {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
