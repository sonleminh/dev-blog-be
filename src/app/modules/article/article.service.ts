import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './entities/article.entity';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/article.dto';
import { UserDocument } from '../user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async createArticle(createArticleDTO: CreateArticleDto, user: UserDocument) {
    try {
      const payload = { ...createArticleDTO, ...{ user: user._id } };
      return await this.articleModel.create(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
