import { IsInt, IsNotEmpty } from 'class-validator';

export class GetCoursesDto {
  @IsNotEmpty()
  @IsInt()
  readonly examCategoryId: number;
}
