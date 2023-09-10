import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
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
  paymentImageUrl: string;

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

  @IsOptional()
  transactionNo: string;

  @IsOptional()
  generatedCode: string;

  @IsOptional()
  paymentStatus: string;

  @IsOptional()
  hidePoints: boolean;
}
