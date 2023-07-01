import { IsInt, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetExerciseChaptersDto {
  @IsNotEmpty()
  @IsInt()
  readonly grade: number;

  @IsNotEmpty()
  @IsMongoId()
  courseId: mongoose.Schema.Types.ObjectId;
}
