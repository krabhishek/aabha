/**
 * Risk & Compliance - Organization Stakeholders
 *
 * External regulatory organizations including central bank and
 * financial intelligence unit that oversee banking compliance.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RiskComplianceContext } from '../../contexts/risk-compliance.context.js';
import {
  GenaiCentralBankPersona,
  GenaiFinancialIntelligenceUnitPersona
} from '../../personas/organization/regulatory.persona.js';

// ============================================================================
// Regulatory Organizations
// ============================================================================

@Stakeholder({
  type: StakeholderType.Organization,
  role: 'Banking Regulator',
  persona: GenaiCentralBankPersona,
  context: RiskComplianceContext,
  goals: [
    'Maintain financial system stability',
    'Ensure OgPgyBank compliance with regulations',
    'Protect depositor interests',
    'Monitor capital adequacy and risk management'
  ],
  responsibilities: [
    'Banking license supervision',
    'Review regulatory returns',
    'Conduct on-site examinations',
    'Enforce capital adequacy requirements',
    'Receive and act on incident reports',
    'Approve major changes to banking operations'
  ],
  permissions: [
    'request_regulatory_reports',
    'conduct_audits',
    'access_bank_records',
    'impose_penalties',
    'suspend_operations',
    'require_corrective_actions'
  ],
  influence: 'high',
  engagement: 'monthly',
  description: 'Central bank supervising OgPgyBank operations and ensuring regulatory compliance'
})
export class BankingRegulatorStakeholder {}

@Stakeholder({
  type: StakeholderType.Organization,
  role: 'AML Enforcement Authority',
  persona: GenaiFinancialIntelligenceUnitPersona,
  context: RiskComplianceContext,
  goals: [
    'Detect money laundering through OgPgyBank',
    'Receive timely STRs from the bank',
    'Combat terrorism financing',
    'Support law enforcement investigations'
  ],
  responsibilities: [
    'Receive and analyze STRs from OgPgyBank',
    'Provide feedback on STR quality',
    'Conduct AML audits',
    'Investigate financial crime patterns',
    'Enforce AML/CFT regulations',
    'Coordinate with international FIUs'
  ],
  permissions: [
    'receive_STRs',
    'request_transaction_records',
    'conduct_aml_audits',
    'impose_aml_penalties',
    'freeze_accounts',
    'refer_for_prosecution'
  ],
  influence: 'high',
  engagement: 'occasional',
  description: 'Financial Intelligence Unit enforcing AML/CFT compliance and investigating financial crimes'
})
export class AMLEnforcementAuthorityStakeholder {}
