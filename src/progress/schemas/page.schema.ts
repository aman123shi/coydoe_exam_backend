import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop()
  courseId: mongoose.Schema.Types.ObjectId;

  @Prop()
  year: number;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  page: number;

  @Prop()
  isSubmitted: boolean;

  @Prop()
  pageSize: number;
  //to be modified to timestamps
  @Prop({ default: 0 })
  startTime: number;

  @Prop({ default: Date.now() })
  submittedTime: number;
}

export const PageSchema = SchemaFactory.createForClass(Page);
