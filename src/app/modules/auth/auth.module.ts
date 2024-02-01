/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<IAuthConfig['JWT_SECRET_KEY']>(
          AuthConfigKey.JWT_SECRET_KEY,
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService,LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService,LocalStrategy],
})
export class AuthModule {}
