import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleEntity } from './entities/article.entity';
import { Model, Types } from 'mongoose';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { paginateCalculator } from 'src/app/utils/page-helpers';
import { TagService } from '../tag/tag.service';
import getLast30DaysRange from 'src/app/utils/getCurrentMonthRange';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleEntity.name) private articleModel: Model<ArticleEntity>,
    private readonly firebaseService: FirebaseService,
    private readonly tagService: TagService,
  ) {}

  async findAll({ page, limit, tag, find_option }) {
    try {
      const key = { is_deleted: { $ne: true } };
      const { start } = getLast30DaysRange();

      const { resPerPage, passedPage } = paginateCalculator(page, limit);

      const filterObject = tag ? { ...key, tags: tag } : { ...key };

      let pipeline = [];

      if (find_option === 'HOME') {
        pipeline = [
          { $match: key },
          {
            $facet: {
              recent_articles: [{ $sort: { date: -1 } }, { $limit: 10 }],
              FE_articles: [{ $match: { tags: 'front-end' } }, { $limit: 6 }],
              BE_articles: [{ $match: { tags: 'back-end' } }, { $limit: 6 }],
              trending_articles: [
                { $match: { createdAt: { $gte: start } } },
                { $sort: { views: -1 } },
                { $limit: 4 },
              ],
            },
          },
        ];
      }

      console.log('tag:', tag)

      const [res, tags, total] = await Promise.all([
        pipeline.length
          ? this.articleModel.aggregate(pipeline).exec()
          : this.articleModel
              .find(filterObject)
              .limit(resPerPage)
              .skip(passedPage)
              .lean()
              .exec(),
        (await this.tagService.getAllTag()).map(({ value, label }) => ({
          value,
          label,
        })),
        this.articleModel.countDocuments(filterObject),
      ]);

      if (pipeline.length) {
        const { FE_articles, BE_articles, recent_articles, trending_articles } =
          res[0];

        return {
          recent_articles,
          FE_articles,
          BE_articles,
          trending_articles,
          tags,
          total,
        };
      }

      return {
        articleList: res,
        total,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTrending() {
    try {
      const { start, end } = getLast30DaysRange();
      const key = {
        is_deleted: { $ne: true },
        createdAt: { $gte: start, $lte: end },
      };

      const [res, total] = await Promise.all([
        this.articleModel.find(key).sort({ views: -1 }).lean().exec(),
        this.articleModel.countDocuments(key),
      ]);
      return { articleList: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getInitialArticleForCreate() {
    const tags = (await this.tagService.getAllTag()).map(
      ({ value, label }) => ({
        value,
        label,
      }),
    );
    return {
      tags,
    };
  }

  async getArticleById(id: Types.ObjectId) {
    try {
      const article = await this.articleModel.findById(id);
      return article;
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
      console.log(createArticleDTO)
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

  async update(
    id: Types.ObjectId,
    body: UpdateArticleDto,
    thumbnail_image: Express.Multer.File,
  ) {
    const entity = await this.articleModel
      .findById(id)
      .where({ is_deleted: { $ne: true } })
      .lean();

    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    let newData: ArticleEntity = { ...entity, ...body };

    if (thumbnail_image) {
      const [imageUrl] = await Promise.all([
        this.firebaseService.uploadFile(thumbnail_image),
        this.firebaseService.deleteFile(entity.thumbnail_image),
      ]);
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
  }

  async deleteSoft(id: string): Promise<{ deleteCount: number }> {
    const entity = await this.articleModel
      .findById(id)
      .where({ is_deleted: { $ne: true } })
      .lean()
      .exec();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }
    await this.articleModel
      .findByIdAndUpdate(id, { is_deleted: true }, { new: true })
      .exec();
    return {
      deleteCount: 1,
    };
  }

  async updateViews(article_id: string) {
    const article_entity = await this.articleModel
      .findById(article_id)
      .lean()
      .exec();

    const newData = { ...article_entity, views: ++article_entity.views };
    return await this.articleModel
      .findByIdAndUpdate(article_id, newData, {
        new: true,
      })
      .exec();
  }
}
