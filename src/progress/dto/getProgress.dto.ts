import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetProgressDto {
  @IsNotEmpty()
  courseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  year: number;
}
