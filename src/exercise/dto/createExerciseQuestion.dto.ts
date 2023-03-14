import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateExerciseQuestionDto {
  @IsNotEmpty()
  readonly questionText: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly exerciseId: mongoose.Schema.Types.ObjectId; //Entrance COC
}
