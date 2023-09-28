import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetMaterialResourceDto {
  @IsNotEmpty()
  readonly grade: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly courseId?: mongoose.Schema.Types.ObjectId; //Entrance COC
}
