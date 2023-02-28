import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class ClerkDataEntryReportDTO {
  @IsNotEmpty()
  readonly courseId: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty()
  readonly clerkId: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty()
  @IsOptional()
  readonly questionId?: mongoose.Schema.Types.ObjectId | string;

  @IsNotEmpty()
  @IsOptional()
  count?: number;
}
