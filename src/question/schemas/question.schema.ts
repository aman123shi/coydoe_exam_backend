import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
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
  year: number;

  @Prop()
  // @ManyToOne((type) => CourseEntity)
  course: number; //Biology Math

  @Prop({ nullable: true })
  // @ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: number; //natural social
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
