import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DirectionDocument = HydratedDocument<Direction>;

@Schema({ timestamps: true })
export class Direction {
  @Prop({ type: 'longtext' })
  directionText: string;

  @Prop({ type: 'longtext', nullable: true })
  sectionName: string; //section three grammar

  @Prop()
  directionNumber: number;

  @Prop()
  startQuestionNumber: number;

  @Prop()
  endQuestionNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  course: mongoose.Schema.Types.ObjectId;

  @Prop()
  courseYear: number;

  @Prop({ type: 'longtext', nullable: true })
  passage: string;
}

export const DirectionSchema = SchemaFactory.createForClass(Direction);
