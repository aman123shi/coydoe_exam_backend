import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FixedChallengesDocument = HydratedDocument<FixedChallenges>;

@Schema({ timestamps: true })
export class FixedChallenges {
  @Prop()
  level: number;

  @Prop({ default: 40 })
  minimumPointsRequiredToComplete: number;
}

export const FixedChallengesSchema =
  SchemaFactory.createForClass(FixedChallenges);
