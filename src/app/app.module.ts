import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';

import { DbConfigKey, IDbConfig } from './config/database.config';
import { configurations } from './config/config';

import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 10, limit: 200 }],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<IDbConfig['MONGO_HOST']>(
          DbConfigKey.MONGO_HOST,
        );
        const username = configService.get<IDbConfig['MONGO_USER']>(
          DbConfigKey.MONGO_USER,
        );
        const password = configService.get<IDbConfig['MONGO_PASSWORD']>(
          DbConfigKey.MONGO_PASSWORD,
        );
        return {
          uri: `mongodb+srv://${username}:${password}@${host}/`,
        };
      },
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    UploadModule,
  ],
})
export class AppModule {}
