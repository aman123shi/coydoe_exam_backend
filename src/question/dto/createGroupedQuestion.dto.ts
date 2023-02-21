import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateGroupedQuestionDto {
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
  readonly description: string;

  @IsNotEmpty()
  readonly year: string;

  @IsNotEmpty()
  @IsOptional()
  readonly questionNumber: string;

  @IsNotEmpty()
  readonly courseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  readonly direction: mongoose.Schema.Types.ObjectId; //to which direction it belongs

  @IsNotEmpty()
  @IsOptional()
  readonly subExamCategory?: number; //natural social
}
