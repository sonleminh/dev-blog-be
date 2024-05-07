import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfigKey, IAppConfig } from '../config/app.config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from '../config/validation.config';
import * as cookieParser from 'cookie-parser';
import { AuthConfigKey, IAuthConfig } from '../config/auth.config';
import path = require('path');

export class App {
  public static async start(module: any) {
    const app = await NestFactory.create<NestExpressApplication>(module);
    await App.setup(app);
  }

  public static async setup(app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    const apiPrefix = configService.get<IAppConfig['API_PREFIX']>(
      AppConfigKey.APP_PREFIX,
    );
    app.use(helmet());
    app.enableCors({
      origin: ['http://localhost:3000'],
      methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
      credentials: true,
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
    });

    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new ValidationPipe(ValidationConfig));
    app.use(
      cookieParser(
        configService.get<IAuthConfig['CK_SECRET']>(AuthConfigKey.CK_SECRET),
      ),
    );
    app.useStaticAssets(path.join(__dirname, '..', 'assets'), {
      prefix: `${apiPrefix}/assets`,
    });
    await app.listen(
      configService.get<IAppConfig['PORT']>(AppConfigKey.PORT),
      async () => {
        console.log(
          `The server is running with ${configService.get<IAppConfig['PORT']>(AppConfigKey.PORT)}`,
        );
      },
    );
  }
}
