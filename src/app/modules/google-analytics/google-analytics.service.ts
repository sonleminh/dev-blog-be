import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

@Injectable()
export class GoogleAnalyticsService {
  private readonly jwtClient: any;
  private readonly analyticsDataClient: BetaAnalyticsDataClient;

  constructor() {
    const data = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));

    this.jwtClient = new google.auth.JWT({
      email: data.client_email,
      key: data.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: data,
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
