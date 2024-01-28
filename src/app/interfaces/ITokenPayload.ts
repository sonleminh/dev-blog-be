import { Types } from 'mongoose';
import { User } from '../modules/user/user.entity';

export interface ITokenPayload extends Pick<User, 'username'> {
  _id: Types.ObjectId;
}
