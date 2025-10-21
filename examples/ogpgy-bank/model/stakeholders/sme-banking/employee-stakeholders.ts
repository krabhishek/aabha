/**
 * SME Banking - Employee Stakeholders
 *
 * Business relationship managers and SME banking specialists serving
 * small and medium enterprise customers.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { SMEBankingContext } from '../../contexts/sme-banking.context.js';
import {
  JamesAndersonSMEPersona
} from '../../personas/human/employees/front-office.persona.js';

// ============================================================================
// SME Banking Team
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Business Relationship Manager',
  persona: JamesAndersonSMEPersona,
  context: SMEBankingContext,
  goals: [
    'Be banking partners, not just banks for SMEs',
    'Grow SME customer base and wallet share',
    'Help SMEs succeed financially',
    'Deliver "Business in a Box" solution'
  ],
  responsibilities: [
    'Manage portfolio of SME customers',
    'Provide business financial advice',
    'Structure business loans and financing',
    'Cross-sell treasury and merchant services',
    'Understand industry-specific needs',
    'Build long-term business relationships'
  ],
  permissions: [
    'access_sme_customer_profiles',
    'approve_business_loans',
    'structure_financing_deals',
    'override_certain_credit_limits',
    'access_business_analytics',
    'recommend_treasury_services'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Business relationship manager partnering with SMEs on growth and financial strategy'
})
export class BusinessRelationshipManagerStakeholder {}
