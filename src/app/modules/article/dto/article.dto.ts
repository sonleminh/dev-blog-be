import { IsArray, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../../user/user.entity';
import { Prop } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { changeObjStringToArray, changeStringToArray } from 'src/app/utils/transform';
import { TagsDto } from './tag.dto';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  title: string;

  @IsNotEmpty()
  // @ValidateNested()
  // @Type(() => TagsDto)
  // @Transform(({ value }) => changeObjStringToArray(val ue))
  @Transform(({ value }) => changeObjStringToArray(value))
  tags: string[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 1000, { message: 'Độ dài đoạn tóm tắt từ 1-1000 ký tự!' })
  summary: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  // @IsString()
  // @Length(0)
  // id_category: string;

  @IsOptional()
  thumbnail_image?: string | null;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  title: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TagsDto)
  tags: TagsDto[];

  @IsOptional()
  @IsString()
  @Length(1, 1000, { message: 'Độ dài đoạn tóm tắt từ 1-1000 ký tự!' })
  summary: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  // @IsOptional()
  // @IsString()
  // @Length(0)
  // id_category: string;
}

export class UpdateArticleViewsDto {
  @IsMongoId()
  article_id: string;
}