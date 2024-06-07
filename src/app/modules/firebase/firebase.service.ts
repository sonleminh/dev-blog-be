import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { IFirebaseConfig } from 'src/app/config/firebase.config';
// import jsonc from '../../../../dev-blog-7a694-firebase-adminsdk-4jhng-d70559a8b6.json'

@Injectable()
export class FirebaseService {
  private storage: admin.storage.Storage;

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
    // const serviceAccount = require('../../../../dev-blog-7a694-firebase-adminsdk-4jhng-d70559a8b6.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(firebaseConfig),
    //   storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    // });
    // this.storage = admin.storage();
    console.log('log1:', firebaseConfig.clientEmail)
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }

  async testlog() {
    console.log('log:', this.configService.get('PRIVATE_KEY'))
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // const storage = this.storage as admin.storage.Storage
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

      stream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(imageUrl);
      });

      stream.end(file.buffer);
    });
  }
}
