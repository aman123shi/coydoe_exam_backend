import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MaterialResourceDocument = HydratedDocument<MaterialResource>;

@Schema({ timestamps: true })
export class MaterialResource {
  @Prop()
  url: string;

  @Prop()
  grade: number;

  @Prop()
  chapter: number;

  @Prop()
  courseId: string;
}

export const MaterialResourceSchema =
  SchemaFactory.createForClass(MaterialResource);
