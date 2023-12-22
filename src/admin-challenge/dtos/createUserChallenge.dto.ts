import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserChallengeDTO {
  @IsNotEmpty()
  @IsOptional()
  readonly level: number;

  @IsNotEmpty()
  @IsOptional()
  readonly courseId: mongoose.Schema.Types.ObjectId;
}
