import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetGroupedQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly directionId: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly courseId?: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly year?: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly directionNumber?: number;
}
