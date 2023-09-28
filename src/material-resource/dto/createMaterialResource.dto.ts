import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMaterialResourceDto {
  @IsOptional()
  url?: string;

  @IsOptional()
  readonly pdfDocument?: string;

  @IsNotEmpty()
  readonly chapter: number;

  @IsNotEmpty()
  readonly grade: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly courseId?: mongoose.Schema.Types.ObjectId; //Entrance COC
}
