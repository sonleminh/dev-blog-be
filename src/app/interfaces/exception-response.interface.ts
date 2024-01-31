import { Request } from 'express';
import { UserDocument } from '../modules/user/user.entity';

export interface RequestExpress extends Request {
  user: UserDocument;
}
