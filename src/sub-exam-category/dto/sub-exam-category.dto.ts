import { IsNotEmpty } from 'class-validator';

export class SubExamCategoryDto {
  @IsNotEmpty()
  readonly name: string;
}
