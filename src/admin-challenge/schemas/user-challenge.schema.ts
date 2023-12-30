import { QuestionInfo } from '@app/challenge/dto/createChallenge.dto';
import { User } from '@app/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserChallengeDocument = HydratedDocument<UserChallenge>;

@Schema({ timestamps: true })
export class UserChallenge {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AdminChallenge' })
  adminChallenge: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  opponentId: mongoose.Schema.Types.ObjectId | User;

  @Prop({ default: 0 })
  point: number;

  @Prop({ default: 7 })
  level: number;

  @Prop({ default: false })
  opponentAssigned: boolean;

  @Prop({ default: false })
  challengeSubmitted: boolean;

  @Prop({ default: false })
  win: boolean;

  @Prop([
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: String,
    },
  ])
  questions: QuestionInfo[];
}

export const UserChallengeSchema = SchemaFactory.createForClass(UserChallenge);
