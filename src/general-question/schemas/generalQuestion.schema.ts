import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GeneralQuestionDocument = HydratedDocument<GeneralQuestion>;

@Schema({ timestamps: true })
export class GeneralQuestion {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory' })
  examCategory: mongoose.Schema.Types.ObjectId;
}

export const GeneralQuestionSchema =
  SchemaFactory.createForClass(GeneralQuestion);
