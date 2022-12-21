import { IsInt, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class GetCoursesDto {
  @IsNotEmpty()
  @IsInt()
  readonly examCategoryId: mongoose.Types.ObjectId;
}
