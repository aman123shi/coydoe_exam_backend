import { IsNotEmpty } from 'class-validator';

export class CreateDataClerkDTO {
  @IsNotEmpty()
  readonly fullName: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
