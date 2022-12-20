import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string;

  @Prop({ default: false })
  hasDirections: boolean;

  @Prop({ nullable: false })
  //   @ManyToOne((type) => ExamCategoryEntity)
  examCategory: number; //Entrance COC
}

export const CourseSchema = SchemaFactory.createForClass(Course);
