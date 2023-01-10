import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  country: string;

  @Prop()
  region: string;

  @Prop()
  email: string;

  @Prop()
  gender: string;

  @Prop()
  studentType: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  rewardPoint: number;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ nullable: true })
  socketId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
