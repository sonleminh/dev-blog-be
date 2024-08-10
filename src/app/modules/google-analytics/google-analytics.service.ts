import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
// import * as fs from 'fs';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAnalyticsService {
  private readonly jwtClient: any;
  private readonly analyticsDataClient: BetaAnalyticsDataClient;

  constructor(private configService: ConfigService) {
    // const data = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));

    this.jwtClient = new google.auth.JWT({
      email: this.configService.get('GA_CLIENT_EMAIL'),
      key: this.configService.get('GA_PRIVATE_KEY'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        type: this.configService.get('GA_TYPE'),
        project_id: this.configService.get('GA_PROJECT_ID'),
        private_key_id: this.configService.get('GA_PRIVATE_KEY_ID'),
        private_key: this.configService.get('GA_PRIVATE_KEY'),
        client_email: this.configService.get('GA_CLIENT_EMAIL'),
        client_id: this.configService.get('GA_CLIENT_ID'),
        token_url: this.configService.get('GA_TOKEN_URI'),
        universe_domain: this.configService.get('GA_UNIVERSE_DOMAIN'),
      },
    });
  }

  async getViews() {
    const response = await this.analyticsDataClient.runReport({
      property: `properties/452132200`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'fullPageUrl' }, { name: 'pageTitle' }],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    const result = [];

    response[0]?.rows?.forEach(({ dimensionValues, metricValues }) => {
      const pageUrl: string = dimensionValues[0]?.value;
      const viewCount: string = metricValues[0]?.value;
      const pageTitle: string = dimensionValues[1]?.value;

      if (pageUrl.includes('blog/')) {
        result?.push({
          pageUrl,
          viewCount,
          pageTitle,
        });
      }
    });

    return result;
  }
}
