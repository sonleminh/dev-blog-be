import {
  Body,
  Controller,
  Get,
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
  ): Promise<{ fullName: string; accessToken: string; refreshToken: string }> {
    // @Body() authCredentialsDto: AuthCredentialsDto,
    // @Res({ passthrough: true }) res: Response,
    // console.log('1:', req.user);
    return this.authService.generateJwtToken(req.user, res);
    // return 'ccc';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('refresh-token')
  async refreshToken(@Request() req) {
    return this.authService.processRefreshToken(req);
  }
}
