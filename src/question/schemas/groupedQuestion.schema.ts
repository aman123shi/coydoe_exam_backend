import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  courseId: number;

  @Prop()
  year: number;

  @Prop()
  questionNumber: number;

  @Prop()
  //@ManyToOne((type) => DirectionEntity)
  direction: number; //Biology Math

  @Prop({ nullable: true })
  //@ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: number; //natural social
}

export const GroupedQuestionSchema =
  SchemaFactory.createForClass(GroupedQuestion);
