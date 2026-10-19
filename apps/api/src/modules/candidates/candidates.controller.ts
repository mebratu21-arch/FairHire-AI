import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CurrentTenant } from '../../common/tenant/tenant.decorator';
import { CurrentUser, RequestUser } from '../../common/auth/user.decorator';
import { RolesGuard, Roles } from '../../common/auth/roles.guard';
import { CreateDecisionSchema, UnmaskSchema } from '@fairhire/shared';

@Controller('api/v1')
@UseGuards(RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('jobs/:jobId/candidates')
  async listForJob(
    @CurrentTenant() companyId: string,
    @Param('jobId') jobId: string,
    @Query('status') status?: any,
  ) {
    const candidates = await this.candidatesService.list(companyId, jobId, { status });
    return { success: true, data: candidates };
  }

  @Get('candidates/:id')
  async get(@CurrentTenant() companyId: string, @Param('id') id: string) {
    const candidate = await this.candidatesService.getById(companyId, id);
    return { success: true, data: candidate };
  }

  @Post('candidates/:id/unmask')
  @Roles('ADMIN', 'RECRUITER')
  async unmask(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const { reason } = UnmaskSchema.parse(body);
    const result = await this.candidatesService.unmask(companyId, id, user.id, reason);
    return { success: true, data: result };
  }

  @Post('candidates/:id/decision')
  @Roles('ADMIN', 'RECRUITER', 'HIRING_MANAGER')
  async recordDecision(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const validated = CreateDecisionSchema.parse(body);
    const result = await this.candidatesService.recordDecision(companyId, id, user.id, validated);
    return { success: true, data: result };
  }
}
