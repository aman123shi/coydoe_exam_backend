import { ExamCategory } from '@app/exam-category/schemas/examCategory.schema';
import { SubExamCategory } from '@app/sub-exam-category/schemas/subExamCategory.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string; //biology ,NaturalMath,SocialMath

  @Prop({ default: false })
  hasDirections: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory' })
  examCategory: mongoose.Schema.Types.ObjectId | ExamCategory; //Entrance COC Law

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubExamCategory' })
  subExamCategory: mongoose.Schema.Types.ObjectId | SubExamCategory; //natural social
}

export const CourseSchema = SchemaFactory.createForClass(Course);
