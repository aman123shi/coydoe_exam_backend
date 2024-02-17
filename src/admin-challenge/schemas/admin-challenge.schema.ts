import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminChallengeDocument = HydratedDocument<AdminChallenge>;

@Schema({ timestamps: true })
export class AdminChallenge {
  @Prop()
  label: string;

  @Prop()
  level: number;

  @Prop({ default: 10 })
  numberOfQuestions: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isMarkedByCron: boolean;

  @Prop({ default: false })
  hasBeenActivated: boolean;
}

export const AdminChallengeSchema =
  SchemaFactory.createForClass(AdminChallenge);
