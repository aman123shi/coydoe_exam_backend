import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
export class CreateNotificationDto {
  @IsNotEmpty()
  readonly notificationType: string; //['challenge','message']
  @IsNotEmpty()
  readonly message: string;

  @IsBoolean()
  @IsOptional()
  readonly isViewed?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isOpened?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isLink?: boolean;

  @IsMongoId()
  readonly userId:
    | mongoose.Schema.Types.ObjectId
    | mongoose.Types.ObjectId
    | any;

  @IsMongoId()
  @IsOptional()
  readonly referenceId?: mongoose.Types.ObjectId | any;

  @IsMongoId()
  readonly opponentUser:
    | mongoose.Schema.Types.ObjectId
    | mongoose.Types.ObjectId
    | any;
}
