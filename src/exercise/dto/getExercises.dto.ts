import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetExercisesDto {
  @IsNotEmpty()
  readonly grade: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly courseId: mongoose.Schema.Types.ObjectId;
}
