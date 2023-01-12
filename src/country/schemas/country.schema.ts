import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false })
export class Region {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
}
const RegionSchema = SchemaFactory.createForClass(Region);

export type CountryDocument = HydratedDocument<Country>;
@Schema({ timestamps: true })
export class Country {
  @Prop()
  name: string;

  @Prop([{ name: String }])
  regions: Region[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);
