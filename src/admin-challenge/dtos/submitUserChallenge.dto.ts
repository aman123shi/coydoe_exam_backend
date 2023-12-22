import { IsNotEmpty } from 'class-validator';
import { QuestionInfo } from '@app/challenge/dto/createChallenge.dto';

export class SubmitUserChallengeDto {
  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  questionsInfo: QuestionInfo[];
}
