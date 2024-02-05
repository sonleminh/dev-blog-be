import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './entities/article.entity';
import { AuthModule } from '../auth/auth.module';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
