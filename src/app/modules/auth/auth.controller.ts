import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';
import { API_ACTION } from 'src/app/enums/api-action.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDTO } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() registerDTO: RegisterDTO) {
    return this.authService.signUp(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post(API_ACTION.LOGIN)
  async signIn(
    @Request() req,
    @Res({ passthrough: true }) res,
  ): Promise<{
    message: string;
    user: {
      id: string;
      name: string;
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return this.authService.generateJwtToken(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // return this.authService.profile(req);
    if (!req.user) {
      throw new NotFoundException('Not Found User!');
    }
    return req.user;
  }

  @Get('refresh-token')
  async refreshToken(@Request() req) {
    return this.authService.processRefreshToken(req);
  }

  @Get('signout')
  async signout(@Res({ passthrough: true }) res) {
    res.cookie('sessionToken', '', { expires: new Date(Date.now()) });
    return {};
  }
}
