import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    try {
      return this.userService.createUser(authCredentialsDto);
    } catch (error) {
      throw error;
    }
  }
  async signIn(authCredentialsDto: AuthCredentialsDto) {
    try {
      const { username, password } = authCredentialsDto;
      const user = await this.userModel.findOne({ username });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        throw new BadRequestException('Password is not correct');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
