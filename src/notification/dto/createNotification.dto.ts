import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
export class CreateNotificationDto {
  @IsNotEmpty()
  readonly notificationType: string; //['challenge','message']
  @IsNotEmpty()
  readonly message: string;

  @IsBoolean()
  @IsOptional()
  readonly isViewed: boolean;

  @IsMongoId()
  readonly userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  readonly referenceId: mongoose.Types.ObjectId;
}
