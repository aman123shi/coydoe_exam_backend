import { SubExamCategory } from '@app/sub-exam-category/schemas/subExamCategory.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type CourseSubExamCategoryDocument =
  HydratedDocument<CourseSubExamCategory>;

@Schema({ timestamps: true })
export class CourseSubExamCategory {
  @Prop({ nullable: false, type: mongoose.Schema.Types.ObjectId })
  course: Course | mongoose.Schema.Types.ObjectId; //Biology Math

  @Prop({ nullable: false, type: mongoose.Types.ObjectId })
  subExamCategory: mongoose.Schema.Types.ObjectId; //Natural Social
}

export const CourseSubExamCategorySchema = SchemaFactory.createForClass(
  CourseSubExamCategory,
);
