import { ExamCategory } from '@app/exam-category/schemas/examCategory.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string;

  @Prop({ default: false })
  hasDirections: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory' })
  examCategory: mongoose.Schema.Types.ObjectId | ExamCategory; //Entrance COC
}

export const CourseSchema = SchemaFactory.createForClass(Course);
