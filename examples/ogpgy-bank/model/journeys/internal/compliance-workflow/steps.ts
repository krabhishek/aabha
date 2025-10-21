/**
 * Compliance Workflow Journey - Steps
 *
 * Real-time AML/KYC monitoring and automated compliance screening.
 * Transform compliance from blocker to enabler.
 */

import { Step } from '../../../../../../src/index.js';
import {
  ChiefComplianceOfficerStakeholder,
  AMLComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  ChiefRiskOfficer
} from '../../../stakeholders/organizational-stakeholders.js';

// ============================================================================
// Transaction Screening Steps
// ============================================================================

@Step({
  name: 'Transaction Initiated',
  actor: ChiefComplianceOfficerStakeholder,
  order: 1
})
export class TransactionInitiatedStep {}

@Step({
  name: 'Automated AML Screening',
  actor: AMLComplianceOfficerStakeholder,
  order: 2
})
export class AutomatedAMLScreeningStep {}

@Step({
  name: 'Sanctions List Check',
  actor: AMLComplianceOfficerStakeholder,
  order: 3
})
export class SanctionsCheckStep {}

@Step({
  name: 'Risk Scoring',
  actor: ChiefRiskOfficer,
  order: 4
})
export class RiskScoringStep {}

@Step({
  name: 'Manual Review (if needed)',
  actor: ChiefComplianceOfficerStakeholder,
  order: 5
})
export class ManualComplianceReviewStep {}

@Step({
  name: 'Approve or Reject Transaction',
  actor: ChiefComplianceOfficerStakeholder,
  order: 6
})
export class ApproveRejectTransactionStep {}

@Step({
  name: 'File SAR if Needed',
  actor: AMLComplianceOfficerStakeholder,
  order: 7
})
export class FileSARStep {}
