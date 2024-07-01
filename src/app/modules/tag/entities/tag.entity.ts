import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({ collection: 'tags', timestamps: true })
export class TagEntity {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Prop({ require: true, unique: true, type: String })
  value: string;

  @Prop({ require: true, unique: true, type: String })
  label: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const TagSchema = SchemaFactory.createForClass(TagEntity);
