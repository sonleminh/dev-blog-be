import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import generateToken from './utils';
import { ITokenPayload } from 'src/app/interfaces/ITokenPayload';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
  }

  async verifyToken(token: string, secret: string) {
    try {
      const decoded = verify(token, secret) as Partial<ITokenPayload>;
      const user = await this.userService.getUserById(decoded._id);

      if (!user) {
        throw new ForbiddenException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessToken(accessToken: string): Promise<any> {
    try {
      const user = await this.verifyToken(accessToken, this.ATSecret);
      return user;
    } catch (error) {
      if (error.name === 'TokenExpireedError') {
        throw new UnauthorizedException();
      }
    }
  }

  async isTokenExpired(accessToken: string) {
    try {
      return false;
    } catch (error) {
      if (error && error.name === 'TokenExpiredError') {
        return true;
      }
      throw error;
    }
  }

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    try {
      return this.userService.createUser(authCredentialsDto);
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(data: ITokenPayload) {
    try {
      const [AT, RT] = await Promise.all([
        generateToken(data, this.ATSecret, { expiresIn: '7d' }),
        generateToken({ _id: data._id }, this.RTSecret, { expiresIn: '7d' }),
      ]);
      return {
        accessToken: AT,
        refreshToken: RT,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie('rt', refreshToken, {
      sameSite: 'none',
      signed: true,
      httpOnly: true,
      secure: true,
      path: this.CKPath,
    });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto, res: Response) {
    try {
      const user = await this.userService.findAndVerify(authCredentialsDto);
      const { accessToken, refreshToken } = await this.generateTokens({
        _id: user._id,
        username: user.username,
      });
      this.storeRefreshToken(res, refreshToken);
      const { password, ...tempUser } = user['_doc'];
      return { accessToken, user: tempUser };
    } catch (error) {
      throw error;
    }
  }
}
