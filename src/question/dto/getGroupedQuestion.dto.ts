import { IsInt, IsNotEmpty } from 'class-validator';

export class GetGroupedQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly directionId: number;

  @IsNotEmpty()
  @IsInt()
  readonly startQuestion?: number;

  @IsNotEmpty()
  @IsInt()
  readonly endQuestion?: number;
}
