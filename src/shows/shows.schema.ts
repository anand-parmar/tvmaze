import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShowsDocument = HydratedDocument<Shows>;

@Schema()
export class Shows {
  @Prop({ required: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop([{ type: Types.ObjectId, ref: 'Casts' }])
  casts: Types.ObjectId[];
}

export const ShowsSchema = SchemaFactory.createForClass(Shows);
