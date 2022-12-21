import mongoose from 'mongoose';

export class CreateProgressDto {
  courseId?: mongoose.Schema.Types.ObjectId;
  year?: number;
  userId?: mongoose.Schema.Types.ObjectId;
  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  skippedQuestions?: number;
  totalTimes?: number;
  lastPage?: number;
}
