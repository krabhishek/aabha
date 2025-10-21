/**
 * Fraud Investigation Journey - Steps
 *
 * Investigating suspected fraud cases using AI and human expertise.
 */

import { Step } from '../../../../../../src/index.js';
import {
  ChiefRiskOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  ChiefInformationSecurityOfficer
} from '../../../stakeholders/organizational-stakeholders.js';

// ============================================================================
// Fraud Investigation Steps
// ============================================================================

@Step({
  name: 'Fraud Alert Triggered',
  actor: ChiefRiskOfficer,
  order: 1
})
export class FraudAlertTriggeredStep {}

@Step({
  name: 'Gather Transaction Evidence',
  actor: ChiefRiskOfficer,
  order: 2
})
export class GatherTransactionEvidenceStep {}

@Step({
  name: 'Analyze Customer Behavior Pattern',
  actor: ChiefRiskOfficer,
  order: 3
})
export class AnalyzeCustomerBehaviorStep {}

@Step({
  name: 'Review Device and IP Data',
  actor: ChiefInformationSecurityOfficer,
  order: 4
})
export class ReviewDeviceDataStep {}

@Step({
  name: 'AI Fraud Assessment',
  actor: ChiefRiskOfficer,
  order: 5
})
export class AIFraudAssessmentStep {}

@Step({
  name: 'Manual Investigation',
  actor: ChiefRiskOfficer,
  order: 6
})
export class ManualInvestigationStep {}

@Step({
  name: 'Take Action (Block/Allow/Flag)',
  actor: ChiefRiskOfficer,
  order: 7
})
export class TakeActionStep {}

@Step({
  name: 'File Fraud Report',
  actor: ChiefRiskOfficer,
  order: 8
})
export class FileFraudReportStep {}
