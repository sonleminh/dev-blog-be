import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
// import jsonc from '../../../../dev-blog-7a694-firebase-adminsdk-4jhng-d70559a8b6.json'

@Injectable()
export class FirebaseService {
  private storage: admin.storage.Storage;
  private cc: any;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      type: this.configService.get('TYPE'),
      project_id: this.configService.get('PROJECT_ID'),
      private_key_id: this.configService.get('PRIVATE_KEY_ID'),
      private_key: this.configService.get('PRIVATE_KEY'),
      client_email: this.configService.get('CLIENT_EMAIL'),
      client_id: this.configService.get('CLIENT_ID'),
      auth_uri: this.configService.get('AUTH_URI'),
      token_uri: this.configService.get('TOKEN_URI'),
      auth_provider_x509_cert_url: this.configService.get('AUTH_CERT_URL'),
      client_x509_cert_url: this.configService.get('CLIENT_CERT_URL'),
      universe_domain: this.configService.get('UNIVERSAL_DOMAIN'),
    } as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `${this.configService.get('PROJECT_ID')}.appspot.com`,
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const storage = this.getStorageInstance();
    const bucket = storage.bucket();
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Đặt quyền công khai cho file
          await fileUpload.makePublic();
          // Lấy URL tải xuống
          const imageUrl = fileUpload.publicUrl();
          resolve(imageUrl);
        } catch (error) {
          reject(error);
        }
      });

      stream.end(file.buffer);
    });
  }

  async deleteFile(filePath: string) {
    const match = filePath.match(/(?:storage\.googleapis\.com\/.+\/)(.+)/);
    if (!match || match.length < 2) {
      throw new Error(`Invalid file path: ${filePath}`);
    }
    const relativePath = decodeURIComponent(match[1]);
    try {
      const storage = this.getStorageInstance();
      const bucket = storage.bucket();

      const result = await bucket.file(relativePath).delete();
      return result;
    } catch (error) {
      if (error.code === 404) {
        // File not found error code
        console.log(`File ${relativePath} not found, skipping deletion.`);
        return {
          success: false,
          message: `File ${relativePath} not found, skipping deletion.`,
        };
      }
      console.log('error:', error);
      throw new Error(`Failed to delete file ${filePath}`);
    }
  }
}
