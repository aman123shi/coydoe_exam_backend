import { IsInt, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class GetGroupedQuestionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly directionId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  readonly courseId?: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly year?: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  readonly directionNumber?: number;
}
