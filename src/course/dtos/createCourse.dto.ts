import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCourseDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly hasDirections: boolean;

  @IsNotEmpty()
  @IsMongoId()
  readonly examCategory: mongoose.Schema.Types.ObjectId; //Entrance COC

  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  readonly subExamCategory?: mongoose.Schema.Types.ObjectId; //Entrance COC
}
