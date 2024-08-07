import { Module } from '@nestjs/common';
import { GoogleAnalyticsController } from './google-analytics.controller';
import { GoogleAnalyticsService } from './google-analytics.service';

@Module({
  imports: [],
  controllers: [GoogleAnalyticsController],
  providers: [GoogleAnalyticsService],
  exports: [],
})
export class GoogleAnalyticsModule {}
