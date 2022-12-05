import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateAdminDTo {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;

  @IsNotEmpty()
  readonly password: string;
}
