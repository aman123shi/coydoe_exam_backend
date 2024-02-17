import { User } from '@app/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChallengeWinnersDocument = HydratedDocument<ChallengeWinners>;

@Schema({ timestamps: true })
export class ChallengeWinners {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AdminChallenge' })
  adminChallenge: mongoose.Schema.Types.ObjectId;

  @Prop([
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      point: Number,
      rank: Number,
    },
  ])
  winners: any[];
}

export const ChallengeWinnersSchema =
  SchemaFactory.createForClass(ChallengeWinners);
