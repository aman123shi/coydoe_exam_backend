import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetGroupedQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly directionId: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly startQuestion?: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly endQuestion?: number;
}
