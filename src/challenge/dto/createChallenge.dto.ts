import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';
export type QuestionInfo = {
  id: mongoose.Schema.Types.ObjectId;
  answer: string;
};
export class CreateChallengeDto {
  @IsNotEmpty()
  courseId: mongoose.Schema.Types.ObjectId;

  @IsBoolean()
  readonly hasGroupQuestions: boolean;

  @IsNotEmpty()
  assignedPoint: number;

  @IsNotEmpty()
  readonly questions: QuestionInfo[];

  @IsBoolean({})
  readonly isAcceptedByOpponent: boolean;

  @IsBoolean()
  readonly isSubmittedByOpponent: boolean;

  @IsMongoId()
  readonly createdBy: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  readonly opponent: mongoose.Schema.Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isSubmittedByChallenger?: boolean;

  @IsInt()
  @IsOptional()
  challengerScore?: number;

  @IsInt()
  @IsOptional()
  opponentScore?: number;
}
