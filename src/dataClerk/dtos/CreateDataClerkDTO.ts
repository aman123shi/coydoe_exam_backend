import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDataClerkDTO {
  @IsNotEmpty()
  @IsOptional()
  readonly fullName?: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsOptional()
  token?: string;
}
