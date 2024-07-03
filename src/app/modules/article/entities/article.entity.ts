import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { User } from '../../user/user.entity';
// import { Category } from '../../category/entities/category.entity';


@Schema({ collection: 'articles', timestamps: true })
export class ArticleEntity {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  id_user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({})
  tags: string[];

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  content: string;

  @Prop({})
  thumbnail_image: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ unique: true })
  id_slug: string;

  // @Prop({ type: Types.ObjectId, ref: Category.name })
  // id_category: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleEntity);
