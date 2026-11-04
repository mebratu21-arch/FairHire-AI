import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from '../db/database.service';

@Controller('api/health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  checkHealth() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        await this.db.ping();
        return { postgres: { status: 'up' } };
      },
    ]);
  }
}
