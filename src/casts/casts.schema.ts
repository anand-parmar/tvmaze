import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CastsDocument = HydratedDocument<Casts>;

@Schema()
export class Casts {
  @Prop({ required: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Date })
  birthday: Date;
}

export const CastsSchema = SchemaFactory.createForClass(Casts);
