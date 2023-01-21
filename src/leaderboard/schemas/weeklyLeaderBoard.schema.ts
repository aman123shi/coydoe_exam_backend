import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WeeklyLeaderBoardDocument = HydratedDocument<WeeklyLeaderBoard>;

@Schema({ timestamps: true })
export class WeeklyLeaderBoard {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  points: number;
}

export const WeeklyLeaderBoardSchema =
  SchemaFactory.createForClass(WeeklyLeaderBoard);
