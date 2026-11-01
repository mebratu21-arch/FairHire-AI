import { Controller, Post, Body } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { FairnessAuditService } from './fairness-audit.service';
import { ScreeningCriterion } from './screening.types';

@Controller('api/screening')
export class ScreeningController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly fairnessAuditService: FairnessAuditService,
  ) {}

  @Post('evaluate')
  evaluate(
    @Body()
    body: {
      cvText: string;
      criteria: ScreeningCriterion[];
      candidateToken?: string;
    },
  ) {
    return this.screeningService.evaluateCandidate(
      body.cvText,
      body.criteria,
      body.candidateToken,
    );
  }

  @Post('audit')
  audit(
    @Body()
    body: {
      cvTemplate: string;
      criteria: ScreeningCriterion[];
      demographicPairs?: { original: string; counterfactual: string; category: string }[];
    },
  ) {
    const pairs = body.demographicPairs || [
      { original: 'David Miller', counterfactual: 'נועה לוי', category: 'Ethnicity/Language (EN vs Hebrew)' },
      { original: 'David Miller', counterfactual: 'አበበች ታደሰ', category: 'Ethnicity/Language (EN vs Amharic)' },
      { original: 'Johnathan Adams', counterfactual: 'Emily Watson', category: 'Gender Cue (Male vs Female)' },
    ];

    return this.fairnessAuditService.runAudit(body.cvTemplate, body.criteria, pairs);
  }
}
