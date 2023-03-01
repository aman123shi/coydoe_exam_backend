import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DataClerkDocument = HydratedDocument<DataClerk>;

@Schema({ timestamps: true })
export class DataClerk {
  @Prop()
  fullName: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  questionsEntered: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  adminId: mongoose.Schema.Types.ObjectId;
}

export const DataClerkSchema = SchemaFactory.createForClass(DataClerk);
