import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './entities/article.entity';
import { Model, Types } from 'mongoose';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { UserDocument } from '../user/user.entity';
import { compressAndSaveImage } from '../../utils/fs.util';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async getArticleList() {
    try {
      const articleList = await this.articleModel.find()
      return { articleList: articleList };
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getArticleById(id: Types.ObjectId) {
    try {
      const article = await this.articleModel.findById(id)
      return { article: article };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy bài viết!')
    }
  }

  async createArticle(
    createArticleDTO: CreateArticleDto,
    thumbnail_image: Express.Multer.File,
    id_user: string,
  ) {
    // async createArticle(createArticleDTO: CreateArticleDto) {
    try {
      console.log(thumbnail_image)
      // return file;
      // console.log('image:', thumbnail_image);
      // const payload = {
      //   ...createArticleDTO,
      //   ...{ id_user: id_user, id_slug: `${createArticleDTO.title}-123` },
      // };
      // return await this.articleModel.create(payload);
    } catch (error) {
      throw error;
    }
  }
  
  async updateArticle(updateArticleDTO: UpdateArticleDto, id: Types.ObjectId) {
    try {
      return await this.articleModel
        .findByIdAndUpdate(id, updateArticleDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  };

  // async create(thumbnail_image: Express.Multer.File) {
  //   return await compressAndSaveImage(thumbnail_image);
  // }
}
