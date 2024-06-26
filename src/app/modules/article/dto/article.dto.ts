import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../../user/user.entity';
import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { changeStringToArray } from 'src/app/utils/transform';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => changeStringToArray(value))
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
  @Transform(({ value }) => changeStringToArray(value))
  tags: string[];

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
