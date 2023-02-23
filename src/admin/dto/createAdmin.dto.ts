import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateAdminDTo {
  @IsNotEmpty()
  @IsOptional()
  readonly firstName: string;

  @IsNotEmpty()
  @IsOptional()
  readonly lastName: string;

  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly password: string;
}
