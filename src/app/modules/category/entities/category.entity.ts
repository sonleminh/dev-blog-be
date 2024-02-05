import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ require: true, unique: true, type: String })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
