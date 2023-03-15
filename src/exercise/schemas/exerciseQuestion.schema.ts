import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExerciseQuestionDocument = HydratedDocument<ExerciseQuestion>;

@Schema({ timestamps: true })
export class ExerciseQuestion {
  @Prop()
  questionText: string;

  @Prop()
  option_a: string;

  @Prop()
  option_b: string;

  @Prop()
  option_c: string;

  @Prop()
  option_d: string;

  @Prop()
  answer: string;

  @Prop()
  questionImage: string;

  @Prop()
  descriptionImage: string;

  @Prop()
  description: string;

  @Prop()
  questionNumber: number;


  @Prop({ type: mongoose.Schema.Types.ObjectId })
  exerciseId: mongoose.Schema.Types.ObjectId;
}

export const ExerciseQuestionSchema =
  SchemaFactory.createForClass(ExerciseQuestion);
