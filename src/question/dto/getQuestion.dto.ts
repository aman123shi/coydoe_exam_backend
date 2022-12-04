import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly course: number;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsInt()
  @IsOptional()
  readonly subCategory?: number;

  @IsInt()
  @IsOptional({})
  readonly page?: number;

  @IsInt()
  @IsOptional()
  readonly limit?: number;
}
