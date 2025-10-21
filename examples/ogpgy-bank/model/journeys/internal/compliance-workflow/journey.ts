/**
 * Compliance Workflow Journey
 *
 * Real-time AML/KYC monitoring and automated compliance screening.
 * Transform compliance from blocker to enabler.
 */

import { Journey } from '../../../../../../src/index.js';
import {
  ChiefComplianceOfficerStakeholder,
  AMLComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  ChiefRiskOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  FraudDetectionRate,
  CriticalComplianceIncidents
} from '../../../strategy/metrics.js';
import {
  TransactionScreenedMilestone,
  ComplianceDecisionMilestone,
  RegulatoryReportingMilestone
} from './milestones.js';

@Journey({
  name: 'Compliance Workflow Journey',
  primaryStakeholder: ChiefComplianceOfficerStakeholder,
  slug: 'compliance-workflow',
  milestones: [
    { milestone: TransactionScreenedMilestone, order: 1 },
    { milestone: ComplianceDecisionMilestone, order: 2 },
    { milestone: RegulatoryReportingMilestone, order: 3 }
  ],
  participatingStakeholders: [
    ChiefComplianceOfficerStakeholder,
    AMLComplianceOfficerStakeholder,
    ChiefRiskOfficer
  ],
  metrics: [
    FraudDetectionRate,
    CriticalComplianceIncidents
  ],
  outcomes: [
    'Transaction screened for AML/KYC compliance',
    'High-risk transactions flagged and reviewed',
    'Suspicious activity reported to regulators',
    'Audit trail maintained'
  ],
  triggeringEvent: 'Any banking transaction initiated',
  extensions: {
    goal: 'Zero critical compliance incidents in 2025',
    philosophy: '"Compliance is our license to operate—and our competitive moat"',
    transformation: 'From manual reviews to automated real-time monitoring',
    metrics_detail: {
      fraudDetectionRate: '95% target (up from 78%)',
      complianceIncidents: '0 critical incidents target',
      screeningTime: '< 500ms per transaction'
    }
  }
})
export class ComplianceWorkflowJourney {}
