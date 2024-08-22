module.exports = {
  apps: [
    {
      name: 'devblogapi',
      script: 'dist/main.js',
      env: {
        PORT: 8080,
        MONGO_HOST: 'dev-blog.yryy5tp.mongodb.net',
        MONGO_USER: 'sonlele',
        MONGO_PASSWORD: 'devblognha',
        API_PREFIX: '/admin/api',
        AT_SECRET: 'devblogat',
        RT_SECRET: 'devblogrt',
        CK_PATH: '/auth/refresh-token',
        CK_SECRET: 'kfuErhzSVKijS9RsGB5bjJl9M9iMrmLc',
        JWT_SECRET_KEY: 'devblognha',
        RT_SECRET_KEY: 'devblognhart',
        TYPE: 'service_account',
        PROJECT_ID: 'dev-blog-7a694',
        PRIVATE_KEY_ID: 'd70559a8b61d4f9729a4fb8f044a58b7c61f68d1',
        PRIVATE_KEY:
          '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcXLGpgWWz/WEo\nKrvBz415OSOws6p++Cj4bG3F13WVdE1Ii/ZDygOoyhuHLYEurKQL1rHmhJgCjpcm\nGYby48pGVD3lKR9sXc0p3FDU9172me+/GvmhzEhVxmeZOhC8QvkUcyTOWZOLT5cy\nZwgetI4SBFSwpYHt16LubRfm29juzkM8u6i3udzivjYx9+WLc7YwhP8K9oCKdJPz\nnIOv5ItOzxysKxlm0dgMh+4SDwUKrEHHQvDXmumyN77im8wimpzqWzr6TydIA+TL\nTeV3/rTudY5SHVc+jTvHDgqCW3VHNd1aE0eU2QEmQLRf2pSxcCR3JQL3Hr1U00Y/\nO8CavYfrAgMBAAECggEAFTuonMoh7XFv6qm6H2crMm/jNKljN3UcUYT1INftdbdX\n+Qe6H3cNhOE7PM+8KliqkpTJ3d853HPhNDkdITX6GBkRlmKw1fAbOY+H3wrE7425\nUFiTjte7F+oUXRXUu1HYDp83qoXEFeuB3fKX5t7ZRPrThD/hC0oODNud2Xn75v/y\n10yeHawbKC6Nl2ggbzP0j8CVTSBY/ZwQt0GemXeN8JE5/aYG4fcMFWkUJ7Tr74vH\nzoi1eEiJNcdj4EffqOFK88MIcZLeMyURnH1BjauZwIJDk+6rp+QpZDzjPn3r/CgU\nxJn/tWcrtqhI1rZfIu2QtX7uS7WxGnr/yof1tWRj2QKBgQDtq+l6OV1+E5GqC0U3\nJhCKijoq8DldrHjsMQJE/zdvfIDbCf78GmiXVjttwHC+uNl6y7C0k7UJrwoKBVKN\n9Lf9sMiMThRwG445MZ4HMiDTFE0P3dsZU+zXVNpLfOHn9OZLwBM4yoRLNfKjBLi9\nlUJuBAiC0bKNW1+HxdiHbg5FkwKBgQDtWw+Dt1EIcRf54un03E0Gda+1di0ioCh3\nG0TeKz21wioLp0sIAkKyoTYzrk8DpaL+dHkKO6sPLkuCn0+31axcJLPXjyuR19KX\nBHdxPP01eVJ/AA5JdgPwZ+u6gZDv/4iF5Eqf0wSbUyItXm8z1Puq/O7gBekR7zfv\n84zEPpQrSQKBgCkvumUY3c/EWmDKVTNKYGFxtMTOHlLSWZ4snAUS6Stjuvy6Tbqo\nZOmc4u2RBLi4Vc/GzpdsZVoJQEceRwEcoGnRId/WhAotbEcTBxyeHjwV74jJXHeW\nKJvkM3QTbx6APQxxe6NCzQwvjB2d6tnHrNxdzI/HARcn93US3wQRGV4LAoGAYZ+B\naxBb4Nf7H4kn5tExUQXYhg8cE1DCM/LgSWyJjhdVCcP+BUZAvo216F26G+rldjjb\ni8zs12qYHhp+REM7CA8EdRVquyqEcB6jLc0C7BqBRsD0H1zN0/Q6LVSbE0sLkN5L\nnx7Al04DEZv0quHfvP0ZFsT3jqvQWv3WGOUQNhkCgYEAi1WS3XAam2Y0hu8s+WNd\nj9+5gZoUfg/faNY/oQjXTReSEhNGd/O+M0DIUzCZ8zSSMzAlq0pFMhDvcad+8SFO\nl7s6Iq41/bVU1p+4Bzi+ZsVzWvbs2eZUvgn3n14et2Jsxc5ioSHLrp0HGDxmaX7v\n4dPzCIkjpbafAiOfR4OE+qU=\n-----END PRIVATE KEY-----\n',
        CLIENT_EMAIL:
          'firebase-adminsdk-4jhng@dev-blog-7a694.iam.gserviceaccount.com',
        CLIENT_ID: '111683693932918458003',
        AUTH_URI: 'https://accounts.google.com/o/oauth2/auth',
        TOKEN_URI: 'https://oauth2.googleapis.com/token',
        AUTH_PROVIDER_X509_CERT_URL:
          'https://www.googleapis.com/oauth2/v1/certs',
        CLIENT_X509_CERT_URL:
          'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4jhng%40dev-blog-7a694.iam.gserviceaccount.com',
        UNIVERSE_DOMAIN: 'googleapis.com',
      },
    },
  ],
};
