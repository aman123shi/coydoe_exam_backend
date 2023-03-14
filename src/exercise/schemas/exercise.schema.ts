import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ timestamps: true })
export class Exercise {
  @Prop()
  exerciseNumber: string; //biology ,NaturalMath,SocialMath

  @Prop()
  grade: number; //grade 9

  @Prop()
  chapter: number; //chapter 2

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: mongoose.Schema.Types.ObjectId;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
