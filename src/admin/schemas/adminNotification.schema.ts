import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdminNotificationDocument = HydratedDocument<AdminNotification>;

@Schema({ timestamps: true })
export class AdminNotification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DataClerk' })
  clerkId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  count: number;
}

export const AdminNotificationSchema =
  SchemaFactory.createForClass(AdminNotification);
