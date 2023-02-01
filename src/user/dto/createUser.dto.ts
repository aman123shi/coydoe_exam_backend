import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsOptional()
  fullName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsOptional()
  country: string;

  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsOptional()
  region: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  gender: string;

  @IsNotEmpty()
  @IsOptional()
  studentType: string;

  @IsNotEmpty()
  password: string;
}
