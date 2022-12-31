import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
export class CreateNotificationDto {
  @IsNotEmpty()
  readonly notificationType: string;

  @IsBoolean()
  readonly isViewed: boolean;

  @IsMongoId()
  readonly userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  readonly referenceId: mongoose.Schema.Types.ObjectId;
}
