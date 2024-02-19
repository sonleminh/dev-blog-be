import slugify from 'slugify';
import { SLUGIFY_CONFIG } from './slug.util';
import path = require('path');
import sharp = require('sharp');

export async function CompressAndSaveImage(image:Express.Multer.File | undefined | null) {
    if(image) {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const originalName = slugify(path.parse(image.originalname).name, SLUGIFY_CONFIG);
        const metadata = await sharp(image.buffer).metadata();
        const imageWidth = metadata.width ?? 0;
    const imageHeight = metadata.height ?? 0;
    const filename = `${originalName}_${Date.now()}_${imageWidth}_${imageHeight}.webp`;
        console.log(filename)
        return 1;
    }
}