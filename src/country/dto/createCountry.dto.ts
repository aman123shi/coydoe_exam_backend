import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsOptional()
  readonly regions?: { name: string }[];
}
