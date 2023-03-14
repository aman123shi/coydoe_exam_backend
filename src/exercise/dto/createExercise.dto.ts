import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateExerciseDto {
  @IsNotEmpty()
  readonly exerciseNumber: number;

  @IsNotEmpty()
  readonly grade: number;

  @IsNotEmpty()
  readonly chapter: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly courseId: mongoose.Schema.Types.ObjectId; //Entrance COC
}
