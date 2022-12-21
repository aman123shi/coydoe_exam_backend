import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDirectionDto {
  @IsNotEmpty()
  readonly directionText: string;

  @IsNotEmpty()
  readonly sectionName: string; //section three grammar

  @IsNotEmpty()
  @IsInt()
  readonly directionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly startQuestionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly endQuestionNumber: number;

  @IsNotEmpty()
  @IsInt()
  readonly course: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  readonly courseYear: number;

  @IsNotEmpty()
  @IsOptional()
  readonly passage?: string;
}
