import { IsInt, IsNotEmpty } from 'class-validator';

export class GetQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly course: number;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsNotEmpty()
  @IsInt()
  readonly subCategory?: number;

  @IsNotEmpty()
  @IsInt()
  readonly page?: number;

  @IsNotEmpty()
  @IsInt()
  readonly limit?: number;
}
