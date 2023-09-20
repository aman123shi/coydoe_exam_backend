import { IsNotEmpty, IsOptional } from 'class-validator';

export class ExamCategoryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly category: string;
}
