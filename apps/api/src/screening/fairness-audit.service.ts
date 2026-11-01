import { Injectable } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningCriterion } from './screening.types';

export interface CounterfactualAuditReport {
  testCaseName: string;
  originalCandidate: string;
  counterfactualCandidate: string;
  originalScore: number;
  counterfactualScore: number;
  scoreDelta: number;
  tolerance: number;
  passed: boolean;
  notes: string;
}

@Injectable()
export class FairnessAuditService {
  constructor(private readonly screeningService: ScreeningService) {}

  runAudit(
    cvTemplate: string,
    criteria: ScreeningCriterion[],
    demographicPairs: { original: string; counterfactual: string; category: string }[],
  ): CounterfactualAuditReport[] {
    const reports: CounterfactualAuditReport[] = [];
    const TOLERANCE = 2.0; // Max acceptable score delta (2%)

    for (const pair of demographicPairs) {
      const originalCv = cvTemplate.replace(/\{\{NAME\}\}/g, pair.original);
      const counterfactualCv = cvTemplate.replace(/\{\{NAME\}\}/g, pair.counterfactual);

      const evalOrig = this.screeningService.evaluateCandidate(originalCv, criteria, 'eval_orig');
      const evalCounter = this.screeningService.evaluateCandidate(counterfactualCv, criteria, 'eval_counter');

      const delta = Math.abs(evalOrig.overallScore - evalCounter.overallScore);
      const passed = delta <= TOLERANCE;

      reports.push({
        testCaseName: `${pair.category}: "${pair.original}" vs "${pair.counterfactual}"`,
        originalCandidate: pair.original,
        counterfactualCandidate: pair.counterfactual,
        originalScore: evalOrig.overallScore,
        counterfactualScore: evalCounter.overallScore,
        scoreDelta: Math.round(delta * 100) / 100,
        tolerance: TOLERANCE,
        passed,
        notes: passed
          ? 'Counterfactual parity achieved: score invariant to demographic perturbation.'
          : 'DISPARATE IMPACT ALERT: Score changed across demographic attribute.',
      });
    }

    return reports;
  }
}
