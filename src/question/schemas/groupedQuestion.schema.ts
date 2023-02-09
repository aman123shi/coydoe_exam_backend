import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type GroupedQuestionDocument = HydratedDocument<GroupedQuestion>;

@Schema({ timestamps: true })
export class GroupedQuestion {
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
  courseId: mongoose.Schema.Types.ObjectId;

  @Prop()
  year: number;

  @Prop()
  questionNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  //@ManyToOne((type) => DirectionEntity)
  direction: mongoose.Schema.Types.ObjectId; //Biology Math

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  //@ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: mongoose.Schema.Types.ObjectId; //natural social
}

export const GroupedQuestionSchema =
  SchemaFactory.createForClass(GroupedQuestion);
