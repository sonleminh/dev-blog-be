import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({ collection: 'categories', timestamps: true })
export class CategoryEntity {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Prop({ require: true, unique: true, type: String })
  value: string;

  @Prop({ require: true, unique: true, type: String })
  label: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);
