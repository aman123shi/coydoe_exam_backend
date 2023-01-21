import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserPointsDocument = HydratedDocument<UserPoints>;

@Schema({ timestamps: true })
export class UserPoints {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  points: number;
}

export const UserPointsSchema = SchemaFactory.createForClass(UserPoints);
