import { IsInt, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetDirectionDto {
  @IsNotEmpty()
  @IsInt()
  readonly courseId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;
}
