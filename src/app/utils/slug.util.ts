import { Types } from 'mongoose';
import slugify from 'slugify';

export const SLUGIFY_CONFIG = {
  replacement: '-',
  lower: true,
  remove: /[*+~.()'"!:@]/g,
  locale: 'vi',
  strict: true,
};

export function generateSlugId(title: string, objectId: Types.ObjectId): string {
  return `${slugify(title, SLUGIFY_CONFIG)}-${objectId}`;
}
