import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { QuestionInfo } from './createChallenge.dto';

export class SubmitAdditionalQuestionsDto {
  @IsNotEmpty()
  challengeId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  questionsInfo: QuestionInfo[];
}
