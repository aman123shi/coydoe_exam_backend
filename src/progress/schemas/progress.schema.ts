import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop()
  courseId: mongoose.Schema.Types.ObjectId;

  @Prop()
  year: number;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  totalQuestions: number;

  @Prop({ default: 0 })
  correctAnswers: number;

  @Prop({ default: 0 })
  wrongAnswers: number;

  @Prop({ default: 0 })
  totalTime: number;

  @Prop({ default: 0 })
  skippedQuestions: number;

  @Prop({ default: 1 })
  lastPage: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
