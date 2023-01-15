import { IsNotEmpty } from 'class-validator';

export class createChallengeParamsDto {
  @IsNotEmpty()
  courseId: string;
  @IsNotEmpty()
  opponentId: string;
}
