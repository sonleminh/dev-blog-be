import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfigKey, IAppConfig } from '../config/app.config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from '../config/validation.config';

export class App {
  public static async start(module: any) {
    const app = await NestFactory.create<NestExpressApplication>(module);
    await App.setup(app);
  }

  public static async setup(app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    const appPrefix = configService.get<IAppConfig['API_PREFIX']>(
      AppConfigKey.APP_PREFIX,
    );
    app.use(helmet());
    app.setGlobalPrefix(appPrefix);
    app.useGlobalPipes(new ValidationPipe(ValidationConfig));
    await app.listen(configService.get<IAppConfig['PORT']>(AppConfigKey.PORT));
  }
}
