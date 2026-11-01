import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      service: 'fairhire-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  }
}
