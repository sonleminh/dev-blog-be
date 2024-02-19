import slugify from 'slugify';
import { SLUGIFY_CONFIG } from './slug.util';
import path = require('path');
import sharp = require('sharp');
import { mkdirp } from 'mkdirp';

export const getStaticAssetPath = (...paths: string[]) => {
  return decodeURIComponent(
    path.resolve(__dirname, '..', 'assets', ...paths.map((str) => String(str))),
  );
};

export async function compressAndSaveImage(
  image: Express.Multer.File | undefined | null,
) {
  if (image) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const originalName = slugify(
      path.parse(image.originalname).name,
      SLUGIFY_CONFIG,
    );
    const metadata = await sharp(image.buffer).metadata();
    const imageWidth = metadata.width ?? 0;
    const imageHeight = metadata.height ?? 0;
    const filename = `${originalName}_${Date.now()}_${imageWidth}_${imageHeight}.webp`;
    const filePath = getStaticAssetPath(year, month, filename);
    await mkdirp(path.dirname(filePath));
    await sharp(image.buffer).webp().toFile(filePath);
    return encodeURIComponent(year + '/' + month + '/' + filename);
  }
  return undefined;
}
