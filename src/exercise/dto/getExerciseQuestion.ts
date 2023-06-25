import { IsInt, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class GetExerciseQuestionDto {
  @IsNotEmpty()
  @IsInt()
  readonly grade: number;

  @IsNotEmpty()
  @IsMongoId()
  courseId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsInt()
  readonly page: number = 1;

  @IsOptional()
  @IsInt()
  readonly size: number = 10;
}
