import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { RegisterDTO } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByUsername(username: string) {
    return this.userModel.find((user) => user.username === username);
  }

  async getUserById(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(registerDTO: RegisterDTO) {
    const { password, ...rest } = registerDTO;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const data = { password: hashedPassword, ...rest };
    const user = await this.userModel.create(data);

    try {
      const userData = await user.save();
      const { password: userPassword, ...userWithoutPassword } =
        userData['_doc'];
      return userWithoutPassword;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAndVerify(authCredentialsDto: AuthCredentialsDto) {
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
