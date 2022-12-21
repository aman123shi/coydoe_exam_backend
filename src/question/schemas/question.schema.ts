import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
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
  image: string;

  @Prop()
  description: string;

  @Prop()
  year: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  // @ManyToOne((type) => CourseEntity)
  course: mongoose.Schema.Types.ObjectId; //Biology Math

  @Prop({ nullable: true, type: mongoose.Schema.Types.ObjectId })
  // @ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: mongoose.Schema.Types.ObjectId; //natural social
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
