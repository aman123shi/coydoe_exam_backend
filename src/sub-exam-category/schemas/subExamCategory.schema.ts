import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubExamCategoryDocument = HydratedDocument<SubExamCategory>;

@Schema({ timestamps: true })
export class SubExamCategory {
  //social natural
  @Prop()
  name: string;

  //which exam category it belongs
  @Prop()
  examCategory: mongoose.Schema.Types.ObjectId;
}

export const SubExamCategorySchema =
  SchemaFactory.createForClass(SubExamCategory);
