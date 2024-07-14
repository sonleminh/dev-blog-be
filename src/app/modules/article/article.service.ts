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
import { escapeRegExp } from 'src/app/utils/escapeRegExp';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(ArticleEntity.name) private articleModel: Model<ArticleEntity>,
    private readonly firebaseService: FirebaseService,
    private readonly tagService: TagService,
  ) {}

  async findAll({ s, page, limit, find_option }) {
    try {
      const filterObject = {
        is_deleted: { $ne: true },
        ...(s?.length && {
          $or: [
            {
              title: {
                $regex: new RegExp(escapeRegExp(s), 'i'),
              },
            },
            {
              content: {
                $regex: new RegExp(escapeRegExp(s), 'i'),
              },
            },
          ],
        }),
      };
      const { start } = getLast30DaysRange();

      const { resPerPage, passedPage } = paginateCalculator(page, limit);

      let pipeline = [];

      if (find_option === 'HOME') {
        pipeline = [
          { $match: filterObject },
          {
            $facet: {
              recent_articles: [{ $sort: { date: -1 } }, { $limit: 10 }],
              FE_articles: [
                { $match: { 'tags.value': 'front-end' } },
                { $limit: 6 },
              ],
              BE_articles: [
                { $match: { 'tags.value': 'back-end' } },
                { $limit: 6 },
              ],
              trending_articles: [
                { $match: { createdAt: { $gte: start } } },
                { $sort: { views: -1 } },
                { $limit: 4 },
              ],
            },
          },
        ];
      }

      const tags = (await this.tagService.getAllTag()).map(
        ({ value, label }) => ({
          value,
          label,
        }),
      );

      const [res, total] = await Promise.all([
        pipeline.length
          ? this.articleModel.aggregate(pipeline).exec()
          : this.articleModel
              .find(filterObject)
              .limit(resPerPage)
              .skip(passedPage)
              .lean()
              .exec(),

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
        tags,
        total,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByTag(tag: string, { page, limit }) {
    try {
      const filterObject = { is_deleted: { $ne: true }, 'tags.value': tag };
      const { resPerPage, passedPage } = paginateCalculator(page, limit);

      const [res, tags, total] = await Promise.all([
        this.articleModel
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

      const tagDetail = tags.find((item) => item.value === tag);
      return {
        articleList: res,
        tag: tagDetail,
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
    body: CreateArticleDto,
    thumbnail_image: Express.Multer.File,
    id_user: string,
  ) {
    try {
      const imageUrl = await this.firebaseService.uploadFile(thumbnail_image);
      const tags = JSON.parse(body.tags);
      const payload = {
        ...body,
        ...{ id_user: id_user, id_slug: `${body.title}-123` },
        thumbnail_image: imageUrl,
        tags: tags,
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

    let newData: ArticleEntity = {
      ...entity,
      ...body,
      tags: JSON.parse(body.tags),
    };

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

  async incrementView(id: Types.ObjectId) {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.views += 1;
    return article.save();
  }
}
