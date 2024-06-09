import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.repository';
import { FirebaseService } from './firebase.service';

// const firebaseProvider = {
//   provide: 'FIREBASE_APP',
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => {
//     const firebaseConfig = {
//       type: configService.get<string>('TYPE'),
//       project_id: configService.get<string>('PROJECT_ID'),
//       private_key_id: configService.get<string>('PRIVATE_KEY_ID'),
//       private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcXLGpgWWz/WEo\nKrvBz415OSOws6p++Cj4bG3F13WVdE1Ii/ZDygOoyhuHLYEurKQL1rHmhJgCjpcm\nGYby48pGVD3lKR9sXc0p3FDU9172me+/GvmhzEhVxmeZOhC8QvkUcyTOWZOLT5cy\nZwgetI4SBFSwpYHt16LubRfm29juzkM8u6i3udzivjYx9+WLc7YwhP8K9oCKdJPz\nnIOv5ItOzxysKxlm0dgMh+4SDwUKrEHHQvDXmumyN77im8wimpzqWzr6TydIA+TL\nTeV3/rTudY5SHVc+jTvHDgqCW3VHNd1aE0eU2QEmQLRf2pSxcCR3JQL3Hr1U00Y/\nO8CavYfrAgMBAAECggEAFTuonMoh7XFv6qm6H2crMm/jNKljN3UcUYT1INftdbdX\n+Qe6H3cNhOE7PM+8KliqkpTJ3d853HPhNDkdITX6GBkRlmKw1fAbOY+H3wrE7425\nUFiTjte7F+oUXRXUu1HYDp83qoXEFeuB3fKX5t7ZRPrThD/hC0oODNud2Xn75v/y\n10yeHawbKC6Nl2ggbzP0j8CVTSBY/ZwQt0GemXeN8JE5/aYG4fcMFWkUJ7Tr74vH\nzoi1eEiJNcdj4EffqOFK88MIcZLeMyURnH1BjauZwIJDk+6rp+QpZDzjPn3r/CgU\nxJn/tWcrtqhI1rZfIu2QtX7uS7WxGnr/yof1tWRj2QKBgQDtq+l6OV1+E5GqC0U3\nJhCKijoq8DldrHjsMQJE/zdvfIDbCf78GmiXVjttwHC+uNl6y7C0k7UJrwoKBVKN\n9Lf9sMiMThRwG445MZ4HMiDTFE0P3dsZU+zXVNpLfOHn9OZLwBM4yoRLNfKjBLi9\nlUJuBAiC0bKNW1+HxdiHbg5FkwKBgQDtWw+Dt1EIcRf54un03E0Gda+1di0ioCh3\nG0TeKz21wioLp0sIAkKyoTYzrk8DpaL+dHkKO6sPLkuCn0+31axcJLPXjyuR19KX\nBHdxPP01eVJ/AA5JdgPwZ+u6gZDv/4iF5Eqf0wSbUyItXm8z1Puq/O7gBekR7zfv\n84zEPpQrSQKBgCkvumUY3c/EWmDKVTNKYGFxtMTOHlLSWZ4snAUS6Stjuvy6Tbqo\nZOmc4u2RBLi4Vc/GzpdsZVoJQEceRwEcoGnRId/WhAotbEcTBxyeHjwV74jJXHeW\nKJvkM3QTbx6APQxxe6NCzQwvjB2d6tnHrNxdzI/HARcn93US3wQRGV4LAoGAYZ+B\naxBb4Nf7H4kn5tExUQXYhg8cE1DCM/LgSWyJjhdVCcP+BUZAvo216F26G+rldjjb\ni8zs12qYHhp+REM7CA8EdRVquyqEcB6jLc0C7BqBRsD0H1zN0/Q6LVSbE0sLkN5L\nnx7Al04DEZv0quHfvP0ZFsT3jqvQWv3WGOUQNhkCgYEAi1WS3XAam2Y0hu8s+WNd\nj9+5gZoUfg/faNY/oQjXTReSEhNGd/O+M0DIUzCZ8zSSMzAlq0pFMhDvcad+8SFO\nl7s6Iq41/bVU1p+4Bzi+ZsVzWvbs2eZUvgn3n14et2Jsxc5ioSHLrp0HGDxmaX7v\n4dPzCIkjpbafAiOfR4OE+qU=\n-----END PRIVATE KEY-----\n',
//       client_email: 'firebase-adminsdk-4jhng@dev-blog-7a694.iam.gserviceaccount.com',
//       // client_email: configService.get<string>('CLIENT_EMAIL'),
//       client_id: configService.get<string>('CLIENT_ID'),
//       auth_uri: configService.get<string>('AUTH_URI'),
//       token_uri: configService.get<string>('TOKEN_URI'),
//       auth_provider_x509_cert_url: configService.get<string>('AUTH_CERT_URL'),
//       client_x509_cert_url: configService.get<string>('CLIENT_CERT_URL'),
//       universe_domain: configService.get<string>('UNIVERSAL_DOMAIN'),
//     } as admin.ServiceAccount;

//     return admin.initializeApp({
//       credential: admin.credential.cert(firebaseConfig),
//       storageBucket: `${firebaseConfig.projectId}.appspot.com`,
//     });
//   },
// };

@Module({
  // imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
