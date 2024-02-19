import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './entities/article.entity';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/article.dto';
import { UserDocument } from '../user/user.entity';
import { compressAndSaveImage } from '../../utils/fs.util';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async createArticle(createArticleDTO: CreateArticleDto, id_user: string) {
    // async createArticle(createArticleDTO: CreateArticleDto) {
    try {
      const payload = { ...createArticleDTO, ...{ id_user: id_user } };
      return await this.articleModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async create(thumbnail_image: Express.Multer.File) {
    return await compressAndSaveImage(thumbnail_image);
  }
}
