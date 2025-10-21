/**
 * Risk & Compliance - Employee Stakeholders
 *
 * Compliance officers, risk managers, and auditors ensuring regulatory
 * compliance and managing banking risks.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RiskComplianceContext } from '../../contexts/risk-compliance.context.js';
import {
  DrKenjiYamamotoPersona,
  GraceLeePersona
} from '../../personas/human/employees/middle-back-office.persona.js';

// ============================================================================
// Compliance Officers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Compliance Officer',
  persona: DrKenjiYamamotoPersona,
  context: RiskComplianceContext,
  goals: [
    'Achieve zero critical compliance incidents',
    'Transform compliance from blocker to enabler',
    'Automate compliance processes',
    'Maintain regulatory license to operate'
  ],
  responsibilities: [
    'Oversee AML/CFT compliance program',
    'Ensure KYC policy adherence',
    'Manage regulatory reporting',
    'Liaise with regulators',
    'Review and approve compliance policies',
    'Investigate compliance violations'
  ],
  permissions: [
    'access_all_compliance_data',
    'approve_compliance_policies',
    'escalate_to_regulators',
    'mandate_process_changes',
    'access_audit_trails',
    'review_all_transactions'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Chief Compliance Officer ensuring regulatory compliance and transforming compliance culture'
})
export class ChiefComplianceOfficerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'AML Compliance Officer',
  persona: DrKenjiYamamotoPersona,
  context: RiskComplianceContext,
  goals: [
    'Detect and prevent money laundering',
    'File accurate STRs (Suspicious Transaction Reports)',
    'Reduce false positives in alerts',
    'Maintain AML program effectiveness'
  ],
  responsibilities: [
    'Review AML alerts and cases',
    'Investigate suspicious transactions',
    'File STRs with FIU',
    'Conduct enhanced due diligence',
    'Monitor high-risk customers',
    'Train staff on AML procedures'
  ],
  permissions: [
    'access_transaction_monitoring',
    'view_customer_profiles',
    'file_STRs',
    'freeze_suspicious_accounts',
    'request_enhanced_due_diligence',
    'access_sanctions_lists'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'AML officer investigating suspicious activities and ensuring anti-money laundering compliance'
})
export class AMLComplianceOfficerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Internal Auditor',
  persona: GraceLeePersona,
  context: RiskComplianceContext,
  goals: [
    'Provide independent assurance on controls',
    'Identify process improvements',
    'Enable continuous auditing',
    'Be trusted advisor not feared policeman'
  ],
  responsibilities: [
    'Conduct risk-based audits',
    'Test control effectiveness',
    'Review compliance processes',
    'Report findings to audit committee',
    'Follow up on audit recommendations',
    'Assess emerging risks'
  ],
  permissions: [
    'access_all_systems',
    'review_all_processes',
    'interview_staff',
    'access_audit_logs',
    'report_to_board',
    'recommend_improvements'
  ],
  influence: 'high',
  engagement: 'weekly',
  description: 'Internal auditor providing independent assurance and driving continuous improvement'
})
export class InternalAuditorStakeholder {}
