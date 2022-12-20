import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop()
  courseId: number;

  @Prop()
  year: number;

  @Prop()
  userId: number;

  @Prop()
  totalQuestions: number;

  @Prop({ default: 0 })
  correctAnswers: number;

  @Prop({ default: 0 })
  wrongAnswers: number;

  @Prop({ default: 0, type: 'bigint' })
  totalTime: number;

  @Prop({ default: 0 })
  skippedQuestions: number;

  @Prop({ default: 1 })
  lastPage: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
