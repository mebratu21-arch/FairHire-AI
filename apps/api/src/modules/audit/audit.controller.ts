import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CurrentTenant } from '../../common/tenant/tenant.decorator';
import { RolesGuard, Roles } from '../../common/auth/roles.guard';

@Controller('api/v1/audit')
@UseGuards(RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMIN', 'AUDITOR')
  async list(@CurrentTenant() companyId: string, @Query('limit') limit?: string, @Query('entity') entity?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const events = await this.auditService.search(companyId, { limit: parsedLimit, entity });
    return {
      success: true,
      data: events.map((e) => ({
        ...e,
        id: e.id.toString(), // BigInt serialized to string for JSON safety
      })),
    };
  }

  @Get('verify')
  @Roles('ADMIN', 'AUDITOR')
  async verify(@CurrentTenant() companyId: string) {
    const result = await this.auditService.verifyChain(companyId);
    return {
      success: true,
      data: result,
    };
  }
}
