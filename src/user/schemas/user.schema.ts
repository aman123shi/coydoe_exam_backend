import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  country: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  region: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  gender: string;

  @Prop()
  facebookId: string;

  @Prop()
  linkedinId: string;

  @Prop()
  image: string;

  @Prop()
  studentType: string;

  @Prop()
  password: string;

  @Prop({ default: '' })
  transactionNo: string;

  @Prop({ default: '' })
  generatedCode: string;

  @Prop()
  paymentStatus: string;

  @Prop({ default: '' })
  paymentImageUrl: string;

  @Prop({ default: 15 })
  rewardPoint: number;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ nullable: true })
  socketId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
