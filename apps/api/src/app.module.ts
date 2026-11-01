import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ScreeningModule } from './screening/screening.module';
import { AuthModule } from './auth/auth.module';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
  imports: [HealthModule, ScreeningModule, AuthModule, RecruiterModule],
})
export class AppModule {}
