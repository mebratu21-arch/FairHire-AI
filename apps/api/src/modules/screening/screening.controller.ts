import { Controller, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CurrentTenant } from '../../common/tenant/tenant.decorator';
import { CurrentUser, RequestUser } from '../../common/auth/user.decorator';
import { RolesGuard, Roles } from '../../common/auth/roles.guard';
import { SupportedLanguage } from '@fairhire/prompts';

@Controller('api/v1/candidates')
@UseGuards(RolesGuard)
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Post(':id/screen')
  @Roles('ADMIN', 'RECRUITER')
  async screen(
    @CurrentTenant() companyId: string,
    @Param('id') candidateId: string,
    @CurrentUser() user: RequestUser,
    @Query('lang') lang?: SupportedLanguage,
  ) {
    const result = await this.screeningService.screenCandidate(companyId, candidateId, user.id, lang || 'en');
    return { success: true, data: result };
  }
}
