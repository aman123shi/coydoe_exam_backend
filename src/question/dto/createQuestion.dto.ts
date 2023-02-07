import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateQuestionDto {
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

  @IsNotEmpty()
  @IsOptional()
  readonly image?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsNotEmpty()
  readonly year: string;

  @IsNotEmpty()
  readonly course: mongoose.Schema.Types.ObjectId; //Biology Math

  @IsNotEmpty()
  @IsOptional()
  readonly subExamCategory?: mongoose.Schema.Types.ObjectId; //natural social
}
