import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateStudentTypeDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly courses: mongoose.Schema.Types.ObjectId[];
}
