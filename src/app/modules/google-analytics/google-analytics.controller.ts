import { Controller, Get } from '@nestjs/common';
import { GoogleAnalyticsService } from './google-analytics.service';

@Controller('google-analytics')
export class GoogleAnalyticsController {
  constructor(
    private readonly googleAnalyticsService: GoogleAnalyticsService,
  ) {}

  @Get('views')
  async getViews() {
    return this.googleAnalyticsService.getViews();
  }
}
