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

  @IsNotEmpty()
  @IsOptional()
  readonly image?: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsNotEmpty()
  @IsInt()
  readonly courseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  readonly questionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly direction: mongoose.Schema.Types.ObjectId; //to which direction it belongs

  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  readonly subExamCategory?: number; //natural social
}
