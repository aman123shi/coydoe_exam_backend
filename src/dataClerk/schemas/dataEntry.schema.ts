import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { type } from 'os';
import { timestamp } from 'rxjs';

export type ClerkDataEntryReportDocument =
  HydratedDocument<ClerkDataEntryReport>;

@Schema({ timestamps: true })
export class ClerkDataEntryReport {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DataClerk' })
  clerkId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  questionId: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  count: number;

  @Prop({ type: mongoose.Schema.Types.Date })
  createdAt: mongoose.Schema.Types.Date;
}

export const ClerkDataEntryReportSchema =
  SchemaFactory.createForClass(ClerkDataEntryReport);
