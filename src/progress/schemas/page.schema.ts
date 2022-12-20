import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop()
  courseId: number;

  @Prop()
  year: number;

  @Prop()
  userId: number;

  @Prop()
  page: number;

  @Prop()
  isSubmitted: boolean;

  @Prop()
  pageSize: number;
  //to be modified to timestamps
  @Prop({ default: 0, type: 'bigint' })
  startTime: number;

  @Prop({ default: Date.now(), type: 'bigint' })
  submittedTime: number;
}

export const PageSchema = SchemaFactory.createForClass(Page);
