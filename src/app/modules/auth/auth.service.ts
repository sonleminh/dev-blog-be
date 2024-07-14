/* eslint-disable prettier/prettier */
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
import generateToken from '../../utils';
import { ITokenPayload } from 'src/app/interfaces/ITokenPayload';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './dto/register.dto';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';

@Injectable()
export class AuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
  }

  async validateUser(username: string, password: string) {
    const userData = await this.userService.findAndVerify({
      username,
      password,
    });
    return userData;
  }

  async generateJwtToken(
    user: User,
    res: Response,
  ): Promise<{
    message: string;
    user: {
      id: any;
      name: string;
      accessToken: string;
      refreshToken;
    };
  }> {
    const payload = {
      name: user.name,
      id_user: String(user._id),
    };

    return {
      message: 'Login successful',
      user: {
        id: String(user._id),
        name: user.name,
        accessToken: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ),
          // expiresIn: '10s',
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<IAuthConfig['RT_SECRET_KEY']>(
            AuthConfigKey.RT_SECRET_KEY,
          ),
          expiresIn: '7d',
        }),
      },
    };
  }

  extractRefreshToken(req: Request) {
    try {
      const { rt } = req.signedCookies;
      if (!rt) {
        throw new ForbiddenException();
      }

      return rt as string;
    } catch (error) {
      throw error;
    }
  }

  async processRefreshToken(req: Request) {
    try {
      const refreshToken = this.extractRefreshToken(req);
      return '1';
    } catch (error) {
      throw error;
    }
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

  async signUp(registerDTO: RegisterDTO) {
    try {
      return this.userService.createUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }

  // async generateTokens(data: ITokenPayload) {
  //   try {
  //     const [AT, RT] = await Promise.all([
  //       generateToken(data, this.ATSecret, { expiresIn: '7d' }),
  //       generateToken({ _id: data._id }, this.RTSecret, { expiresIn: '7d' }),
  //     ]);
  //     return {
  //       accessToken: AT,
  //       refreshToken: RT,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie('rt', refreshToken, {
      sameSite: 'none',
      signed: true,
      httpOnly: true,
      secure: true,
      path: this.CKPath,
    });
  }
}
