/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionInfo } from '../dto/createChallenge.dto';
export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ type: mongoose.Schema.Types.ObjectId }) // opponentUser
  courseId: mongoose.Schema.Types.ObjectId;
  @Prop({ default: 'pending' })
  status: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  opponent: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  assignedPoint: number;

  @Prop([
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: String,
    },
  ])
  questions: QuestionInfo[];

  @Prop({ default: false })
  isAcceptedByOpponent: boolean;

  @Prop({ default: false })
  hasGroupedQuestions: boolean;

  @Prop({ default: false })
  isSubmittedByOpponent: boolean;

  @Prop({ default: false })
  isSubmittedByChallenger: boolean;

  @Prop({ default: false })
  isAdditionalQuestionSubmitted: boolean;

  @Prop({ default: 0 })
  challengerScore: number;

  @Prop({ default: 0 })
  opponentScore: number;

  @Prop({ default: 0 })
  challengerTime: number;

  @Prop({ default: 0 })
  opponentTime: number;

  @Prop({})
  additionalQuestions: QuestionInfo[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
