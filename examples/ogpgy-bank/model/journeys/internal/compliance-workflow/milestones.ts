/**
 * Compliance Workflow Journey - Milestones
 *
 * Business-significant milestones in compliance screening workflow.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  ChiefComplianceOfficerStakeholder,
  AMLComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  TransactionInitiatedStep,
  AutomatedAMLScreeningStep,
  SanctionsCheckStep,
  RiskScoringStep,
  ManualComplianceReviewStep,
  ApproveRejectTransactionStep,
  FileSARStep
} from './steps.js';

// ============================================================================
// Compliance Milestones
// ============================================================================

@Milestone({
  name: 'Transaction Screened',
  stakeholder: AMLComplianceOfficerStakeholder,
  steps: [
    { step: TransactionInitiatedStep, order: 1 },
    { step: AutomatedAMLScreeningStep, order: 2 },
    { step: SanctionsCheckStep, order: 3 },
    { step: RiskScoringStep, order: 4 }
  ],
  businessEvent: 'compliance.transaction.screened',
  stateful: true,
  reusable: true
})
export class TransactionScreenedMilestone {}

@Milestone({
  name: 'Compliance Decision Made',
  stakeholder: ChiefComplianceOfficerStakeholder,
  steps: [
    { step: ManualComplianceReviewStep, order: 1 },
    { step: ApproveRejectTransactionStep, order: 2 }
  ],
  businessEvent: 'compliance.decision.made',
  stateful: true,
  reusable: true
})
export class ComplianceDecisionMilestone {}

@Milestone({
  name: 'Regulatory Reporting Complete',
  stakeholder: AMLComplianceOfficerStakeholder,
  steps: [{ step: FileSARStep, order: 1 }],
  businessEvent: 'compliance.reporting.complete',
  stateful: true,
  reusable: true
})
export class RegulatoryReportingMilestone {}
