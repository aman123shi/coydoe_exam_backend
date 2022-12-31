import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
export type Question = {
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
  readonly questions: Question[];

  @IsBoolean({})
  readonly isAcceptedByOpponent: boolean;

  @IsBoolean()
  readonly isSubmittedByOpponent: boolean;

  @IsMongoId()
  readonly createdBy: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  readonly opponent: mongoose.Schema.Types.ObjectId;
}
