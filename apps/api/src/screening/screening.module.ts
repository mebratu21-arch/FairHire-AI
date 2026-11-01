import { Module } from '@nestjs/common';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';
import { RedactionService } from './redaction.service';
import { FairnessAuditService } from './fairness-audit.service';

@Module({
  controllers: [ScreeningController],
  providers: [ScreeningService, RedactionService, FairnessAuditService],
  exports: [ScreeningService, RedactionService, FairnessAuditService],
})
export class ScreeningModule {}
