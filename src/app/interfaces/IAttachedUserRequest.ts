import { Request } from 'express';
import { User } from '../modules/user/user.entity';

export interface IAttachedUserRequest extends Request {
  user: User;
}
