import { IsNotEmpty } from 'class-validator';

export class UpdateAdminDTo {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
