import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MonthlyLeaderBoardDocument = HydratedDocument<MonthlyLeaderBoard>;

@Schema({ timestamps: true })
export class MonthlyLeaderBoard {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  points: number;
}

export const MonthlyLeaderBoardSchema =
  SchemaFactory.createForClass(MonthlyLeaderBoard);
