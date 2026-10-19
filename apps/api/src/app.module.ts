import { Module } from '@nestjs/common';
import { DbModule } from './common/db/db.module';
import { AuditModule } from './modules/audit/audit.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { ScreeningModule } from './modules/screening/screening.module';

@Module({
  imports: [
    DbModule,
    AuditModule,
    JobsModule,
    CandidatesModule,
    ScreeningModule,
  ],
})
export class AppModule {}
