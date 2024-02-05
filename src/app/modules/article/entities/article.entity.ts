import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { CommonEntity } from 'src/app/entities/common.entity';
import { User } from '../../user/user.entity';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ collection: 'articles', timestamps: true })
export class Article {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  id_user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({})
  tag: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  content: string;

  @Prop({})
  thumbnail_image: string;

  @Prop({ unique: true })
  id_slug: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
