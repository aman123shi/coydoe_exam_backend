import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExerciseQuestionDocument = HydratedDocument<ExerciseQuestion>;

@Schema({ timestamps: true })
export class ExerciseQuestion {
  @Prop()
  questionText: string; //

  @Prop()
  description: string; //

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  exerciseId: mongoose.Schema.Types.ObjectId;
}

export const ExerciseQuestionSchema =
  SchemaFactory.createForClass(ExerciseQuestion);
