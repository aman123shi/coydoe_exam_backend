import { IsInt, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateExerciseQuestionDto {
  @IsNotEmpty()
  readonly questionText: string;

  @IsNotEmpty()
  readonly option_a: string;

  @IsNotEmpty()
  readonly option_b: string;

  @IsNotEmpty()
  readonly option_c: string;

  @IsNotEmpty()
  readonly option_d: string;

  @IsNotEmpty()
  readonly answer: string;

  @IsOptional()
  questionImage?: string;

  @IsOptional()
  descriptionImage?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly questionNumber: string;

  @IsNotEmpty()
  @IsInt()
  grade: number; //grade 9

  @IsNotEmpty()
  @IsInt()
  chapter: number; //chapter 2

  @IsNotEmpty()
  @IsMongoId()
  courseId: mongoose.Schema.Types.ObjectId;
}
