import { IsInt, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetDirectionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly courseId: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;
}
