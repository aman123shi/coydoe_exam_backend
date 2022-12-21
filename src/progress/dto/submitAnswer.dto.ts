import { IsInt, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsInt()
  readonly courseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  readonly year: 2014;

  @IsNotEmpty()
  answers: {
    questionID: mongoose.Schema.Types.ObjectId;
    skipped: boolean;
    answer?: string;
  }[];

  submittedPage: number;
  isGrouped: boolean = false;
}
