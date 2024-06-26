import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleEntity, ArticleSchema } from './entities/article.entity';
import { AuthModule } from '../auth/auth.module';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TagModule,
    MongooseModule.forFeature([
      { name: ArticleEntity.name, schema: ArticleSchema },
    ]),
    forwardRef(() => AuthModule),
    FirebaseModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
