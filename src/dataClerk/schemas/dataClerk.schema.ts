import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const DataClerkSchema = SchemaFactory.createForClass(DataClerk);
