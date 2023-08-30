import { IsNotEmpty, IsOptional } from 'class-validator';

export class createChallengeParamsDto {
  @IsNotEmpty()
  courseId: string;
  @IsNotEmpty()
  opponentId: string;

  @IsOptional()
  numberOfQuestion: number;
}
