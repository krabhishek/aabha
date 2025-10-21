/**
 * SME Banking - Customer Stakeholders
 *
 * Small and Medium Enterprise owners requiring business banking services,
 * financing, and merchant services.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { SMEBankingContext } from '../../contexts/sme-banking.context.js';
import {
  PriyaKumarPersona,
  JordanWilliamsPersona,
  RobertSantiagoPersona
} from '../../personas/human/customers/sme-owners.persona.js';

// ============================================================================
// SME Business Owners
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Small Business Owner',
  persona: PriyaKumarPersona,
  context: SMEBankingContext,
  goals: [
    'Manage business cash flow effectively',
    'Access business financing for expansion',
    'Simplify merchant payment acceptance',
    'Separate business and personal finances clearly'
  ],
  responsibilities: [
    'Manage business account',
    'Process merchant payments',
    'Track business expenses',
    'Maintain adequate cash reserves',
    'Apply for business loans'
  ],
  permissions: [
    'access_business_account',
    'manage_merchant_services',
    'apply_for_business_loans',
    'access_cash_flow_tools',
    'view_business_analytics'
  ],
  influence: 'medium',
  engagement: 'daily',
  description: 'Small business owner needing integrated banking, merchant services, and cash flow management'
})
export class SmallBusinessOwnerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Startup Founder',
  persona: JordanWilliamsPersona,
  context: SMEBankingContext,
  goals: [
    'Access flexible credit for growth',
    'Use banking APIs for automation',
    'Process international payments efficiently',
    'Scale banking with business growth'
  ],
  responsibilities: [
    'Integrate banking via APIs',
    'Manage business finances',
    'Process international transactions',
    'Monitor credit line utilization',
    'Track subscription revenue'
  ],
  permissions: [
    'access_banking_apis',
    'manage_business_account',
    'process_international_payments',
    'access_credit_line',
    'integrate_with_saas_tools'
  ],
  influence: 'medium',
  engagement: 'daily',
  description: 'Tech-savvy startup founder expecting API-first banking and flexible financing'
})
export class StartupFounderStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Established SME Owner',
  persona: RobertSantiagoPersona,
  context: SMEBankingContext,
  goals: [
    'Secure project financing reliably',
    'Access equipment financing',
    'Get proactive advice from relationship manager',
    'Manage complex treasury needs'
  ],
  responsibilities: [
    'Manage multiple business accounts',
    'Apply for commercial lending',
    'Work with relationship manager',
    'Monitor project cash flows',
    'Maintain banking covenants'
  ],
  permissions: [
    'access_commercial_lending',
    'access_relationship_manager',
    'manage_treasury_services',
    'access_multi_account_management',
    'apply_for_equipment_financing'
  ],
  influence: 'high',
  engagement: 'weekly',
  description: 'Established business owner with complex financing needs and deep relationship manager partnership'
})
export class EstablishedSMEOwnerStakeholder {}
