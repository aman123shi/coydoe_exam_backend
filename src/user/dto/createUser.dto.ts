import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  studentType: string;

  @IsNotEmpty()
  password: string;
}
