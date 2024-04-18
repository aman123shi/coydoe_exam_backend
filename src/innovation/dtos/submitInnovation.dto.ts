import { IsNotEmpty, IsOptional } from 'class-validator';

export class SubmitInnovationDto {
  @IsOptional()
  readonly pdfDocument?: string;

  @IsNotEmpty()
  readonly fullName: string;

  @IsNotEmpty()
  readonly region: string;

  @IsNotEmpty()
  readonly grade: number;
}
