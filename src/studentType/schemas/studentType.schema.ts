import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StudentTypeDocument = HydratedDocument<StudentType>;

@Schema({ timestamps: true })
export class StudentType {
  @Prop()
  name: string; // grade 12 social , // grade 12 natural

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  courses: mongoose.Schema.Types.ObjectId[];
}

export const StudentTypeSchema = SchemaFactory.createForClass(StudentType);
