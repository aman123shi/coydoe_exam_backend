import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamCategoryDocument = HydratedDocument<ExamCategory>;

@Schema({ timestamps: true })
export class ExamCategory {
  @Prop()
  name: string;
}

export const ExamCategorySchema = SchemaFactory.createForClass(ExamCategory);
