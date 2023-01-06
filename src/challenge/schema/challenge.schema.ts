import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionInfo } from '../dto/createChallenge.dto';

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
  questions: QuestionInfo[];

  @Prop({ default: false })
  isAcceptedByOpponent: boolean;

  @Prop({ default: false })
  hasGroupedQuestions: boolean;

  @Prop({ default: false })
  isSubmittedByOpponent: boolean;

  @Prop({ default: false })
  isSubmittedByChallenger: boolean;

  @Prop({ default: 0 })
  challengerScore: number;
  @Prop({ default: 0 })
  opponentScore: number;
  //:TODO
  //on submit identify if the submitter is a challenger or opponent
  //identify if the other side already submitted
  //if submitted identify the winner and award the point to the winner
  //then create notification for both side and push
  //*else* if not submitted by other side calculate answered question and update user score,submittedByChallenger or Challenger
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
