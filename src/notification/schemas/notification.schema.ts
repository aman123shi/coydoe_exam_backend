import { ExamCategory } from '@app/exam-category/schemas/examCategory.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  notificationType: string; //['challenge','message','learn ']

  @Prop({ default: false })
  isViewed: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId; // to which users it belongs

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  referenceId: mongoose.Schema.Types.ObjectId; // it could refer challenges or messages
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
