/**
 * Fraud Investigation Journey - Milestones
 *
 * Business-significant milestones in fraud investigation process.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  ChiefRiskOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  FraudAlertTriggeredStep,
  GatherTransactionEvidenceStep,
  AnalyzeCustomerBehaviorStep,
  ReviewDeviceDataStep,
  AIFraudAssessmentStep,
  ManualInvestigationStep,
  TakeActionStep,
  FileFraudReportStep
} from './steps.js';

// ============================================================================
// Fraud Investigation Milestones
// ============================================================================

@Milestone({
  name: 'Evidence Collected',
  stakeholder: ChiefRiskOfficer,
  steps: [
    { step: FraudAlertTriggeredStep, order: 1 },
    { step: GatherTransactionEvidenceStep, order: 2 },
    { step: AnalyzeCustomerBehaviorStep, order: 3 },
    { step: ReviewDeviceDataStep, order: 4 }
  ],
  businessEvent: 'fraud.evidence.collected',
  stateful: true,
  reusable: true
})
export class EvidenceCollectedMilestone {}

@Milestone({
  name: 'Fraud Assessment Complete',
  stakeholder: ChiefRiskOfficer,
  steps: [
    { step: AIFraudAssessmentStep, order: 1 },
    { step: ManualInvestigationStep, order: 2 }
  ],
  businessEvent: 'fraud.assessment.complete',
  stateful: true,
  reusable: true
})
export class FraudAssessmentCompleteMilestone {}

@Milestone({
  name: 'Fraud Case Resolved',
  stakeholder: ChiefRiskOfficer,
  steps: [
    { step: TakeActionStep, order: 1 },
    { step: FileFraudReportStep, order: 2 }
  ],
  businessEvent: 'fraud.case.resolved',
  stateful: true,
  reusable: true
})
export class FraudCaseResolvedMilestone {}
