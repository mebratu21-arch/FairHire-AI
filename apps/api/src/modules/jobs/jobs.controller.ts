import { Controller, Get, Post, Patch, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CurrentTenant } from '../../common/tenant/tenant.decorator';
import { CurrentUser, RequestUser } from '../../common/auth/user.decorator';
import { RolesGuard, Roles } from '../../common/auth/roles.guard';
import { CreateJobSchema, UpdateJobSchema, ReplaceJobCriteriaSchema } from '@fairhire/shared';

@Controller('api/v1/jobs')
@UseGuards(RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async list(@CurrentTenant() companyId: string) {
    const jobs = await this.jobsService.list(companyId);
    return { success: true, data: jobs };
  }

  @Post()
  @Roles('ADMIN', 'RECRUITER')
  async create(
    @CurrentTenant() companyId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const validated = CreateJobSchema.parse(body);
    const job = await this.jobsService.create(companyId, user.id, validated);
    return { success: true, data: job };
  }

  @Get(':id')
  async get(@CurrentTenant() companyId: string, @Param('id') id: string) {
    const job = await this.jobsService.getById(companyId, id);
    return { success: true, data: job };
  }

  @Patch(':id')
  @Roles('ADMIN', 'RECRUITER')
  async update(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const validated = UpdateJobSchema.parse(body);
    const updated = await this.jobsService.update(companyId, id, user.id, validated);
    return { success: true, data: updated };
  }

  @Put(':id/criteria')
  @Roles('ADMIN', 'RECRUITER')
  async replaceCriteria(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const validated = ReplaceJobCriteriaSchema.parse(body);
    const result = await this.jobsService.replaceCriteria(companyId, id, user.id, validated.criteria as any);
    return { success: true, data: result };
  }

  @Post(':id/publish')
  @Roles('ADMIN', 'RECRUITER')
  async publish(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    const result = await this.jobsService.publish(companyId, id, user.id);
    return { success: true, data: result };
  }

  @Post(':id/duplicate')
  @Roles('ADMIN', 'RECRUITER')
  async duplicate(
    @CurrentTenant() companyId: string,
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    const result = await this.jobsService.duplicate(companyId, id, user.id);
    return { success: true, data: result };
  }
}
