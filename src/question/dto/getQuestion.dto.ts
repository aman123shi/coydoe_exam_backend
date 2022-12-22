import { IsInt, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class GetQuestionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly course: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  readonly year: number;

  @IsInt()
  @IsOptional()
  readonly subCategory?: mongoose.Schema.Types.ObjectId;

  @IsInt()
  @IsOptional({})
  readonly page?: number;

  @IsInt()
  @IsOptional()
  readonly limit?: number;
}
