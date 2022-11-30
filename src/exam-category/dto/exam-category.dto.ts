import { IsNotEmpty } from 'class-validator';

export class ExamCategoryDto {
  @IsNotEmpty()
  readonly name: string;
}
