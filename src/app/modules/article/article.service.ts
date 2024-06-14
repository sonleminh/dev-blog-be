import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './entities/article.entity';
import { Model, Types } from 'mongoose';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { FirebaseRepository } from '../firebase/firebase.repository';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getArticleList() {
    try {
      const articleList = await this.articleModel.find();
      return { articleList: articleList };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getArticleById(id: Types.ObjectId) {
    try {
      const article = await this.articleModel.findById(id);
      return article ;
    } catch (error) {
      throw new NotFoundException('Không tìm thấy bài viết!');
    }
  }

  async createArticle(
    createArticleDTO: CreateArticleDto,
    thumbnail_image: Express.Multer.File,
    id_user: string,
  ) {
    try {
      const imageUrl = await this.firebaseService.uploadFile(thumbnail_image);
      const payload = {
        ...createArticleDTO,
        ...{ id_user: id_user, id_slug: `${createArticleDTO.title}-123` },
        thumbnail_image: imageUrl,
      };
      return await this.articleModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(
    id: Types.ObjectId,
    body: UpdateArticleDto,
    thumbnail_image: Express.Multer.File,
  ) {
    try {
      // return await this.articleModel
      //   .findByIdAndUpdate(id, updateArticleDTO, { new: true })
      //   .exec();
      const entity = await this.articleModel.findById(id).lean();

      if (!entity) {
        throw new NotFoundException('Đối tượng không tồn tại!!');
      }

      let newData: Article = { ...entity, ...body };

      if (thumbnail_image) {
        const imageUrl = await this.firebaseService.uploadFile(thumbnail_image);
        newData = {
          ...newData,
          thumbnail_image: imageUrl,
        };
      }

      return await this.articleModel
        .findByIdAndUpdate(id, newData, {
          new: true,
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // async create(thumbnail_image: Express.Multer.File) {
  //   return await compressAndSaveImage(thumbnail_image);
  // }
}
