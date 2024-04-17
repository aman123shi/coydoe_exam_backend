import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InnovationDocument = HydratedDocument<Innovation>;

@Schema({ timestamps: true })
export class Innovation {
  @Prop()
  fullName: string;

  @Prop()
  grade: number;

  @Prop()
  region: string;

  @Prop()
  filePath?: string;
}

export const InnovationSchema = SchemaFactory.createForClass(Innovation);
