import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Question } from '../dto/createChallenge.dto';

export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  courseId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  opponent: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  assignedPoint: number;

  @Prop(
    raw({
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: { type: String },
    }),
  )
  questions: Question[];

  @Prop({ default: false })
  isAcceptedByOpponent: boolean;

  @Prop({ default: false })
  hasGroupedQuestions: boolean;

  @Prop({ default: false })
  isSubmittedByOpponent: boolean;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
