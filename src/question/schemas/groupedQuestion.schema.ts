import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupedQuestionDocument = HydratedDocument<GroupedQuestion>;

@Schema({ timestamps: true })
export class GroupedQuestion {
  @Prop({ type: 'longtext' })
  questionText: string;

  @Prop({ type: 'longtext' })
  option_a: string;

  @Prop({ type: 'longtext' })
  option_b: string;

  @Prop({ type: 'longtext' })
  option_c: string;

  @Prop({ type: 'longtext' })
  option_d: string;

  @Prop({ type: 'longtext' })
  answer: string;

  @Prop({ type: 'longtext', nullable: true })
  image: string;

  @Prop({ type: 'longtext' })
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

  @Prop({ nullable: true, type: mongoose.Schema.Types.ObjectId })
  //@ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: mongoose.Schema.Types.ObjectId; //natural social
}

export const GroupedQuestionSchema =
  SchemaFactory.createForClass(GroupedQuestion);
