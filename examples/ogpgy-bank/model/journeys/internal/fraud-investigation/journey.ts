/**
 * Fraud Investigation Journey
 *
 * Investigating suspected fraud cases using AI and human expertise.
 * Protect customers while minimizing false positives.
 */

import { Journey } from '../../../../../../src/index.js';
import {
  ChiefRiskOfficer,
  ChiefInformationSecurityOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  FraudDetectionRate
} from '../../../strategy/metrics.js';
import {
  EvidenceCollectedMilestone,
  FraudAssessmentCompleteMilestone,
  FraudCaseResolvedMilestone
} from './milestones.js';

@Journey({
  name: 'Fraud Investigation Journey',
  primaryStakeholder: ChiefRiskOfficer,
  slug: 'fraud-investigation',
  milestones: [
    { milestone: EvidenceCollectedMilestone, order: 1 },
    { milestone: FraudAssessmentCompleteMilestone, order: 2 },
    { milestone: FraudCaseResolvedMilestone, order: 3 }
  ],
  participatingStakeholders: [
    ChiefRiskOfficer,
    ChiefInformationSecurityOfficer
  ],
  metrics: [
    FraudDetectionRate
  ],
  outcomes: [
    'Fraud cases detected and investigated',
    'Fraudulent transactions blocked',
    'Customer accounts protected',
    'Fraud reports filed'
  ],
  triggeringEvent: 'Fraud alert triggered by AI system',
  extensions: {
    goal: '95% fraud detection rate with < 5% false positives',
    philosophy: '"Protect customers while enabling legitimate transactions"',
    transformation: 'From 78% to 95% fraud detection rate through AI',
    metrics_detail: {
      fraudDetectionRate: '95% target',
      falsePositiveRate: '< 5%',
      investigationTime: '< 2 hours average'
    }
  }
})
export class FraudInvestigationJourney {}
