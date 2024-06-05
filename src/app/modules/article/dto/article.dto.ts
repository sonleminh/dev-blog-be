import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../../user/user.entity';
import { Prop } from '@nestjs/mongoose';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Vui lòng nhập từ 0-30 ký tự!' })
  tag: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 1000, { message: 'Độ dài đoạn tóm tắt từ 1-1000 ký tự!' })
  summary: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0)
  thumbnail_image: string;

  @IsString()
  @Length(0)
  id_category: string;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Vui lòng nhập từ 0-30 ký tự!' })
  tag: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000, { message: 'Độ dài đoạn tóm tắt từ 1-1000 ký tự!' })
  summary: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  @IsOptional()
  @IsString()
  @Length(0)
  thumbnail_image: string;

  @IsOptional()
  @IsString()
  @Length(0)
  id_category: string;
}
