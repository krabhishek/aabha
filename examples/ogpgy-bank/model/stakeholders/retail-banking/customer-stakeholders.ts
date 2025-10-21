/**
 * Retail Banking - Customer Stakeholders
 *
 * Traditional retail banking customers including seniors, families, and
 * customers who prefer branch-assisted services alongside digital channels.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RetailBankingContext } from '../../contexts/retail-banking.context.js';
import {
  MargaretOConnorPersona,
  WilliamChenPersona
} from '../../personas/human/customers/seniors.persona.js';
import {
  MariaSantosPersona,
  DavidEmmaFosterPersona
} from '../../personas/human/customers/families.persona.js';

// ============================================================================
// Senior Customers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Loyal Senior Customer',
  persona: MargaretOConnorPersona,
  context: RetailBankingContext,
  goals: [
    'Manage retirement savings safely',
    'Receive pension payments reliably',
    'Maintain trusted banking relationship',
    'Learn digital banking at comfortable pace with assistance'
  ],
  responsibilities: [
    'Maintain account security',
    'Report any suspicious activity',
    'Participate in assisted digital training',
    'Provide feedback on senior-friendly features'
  ],
  permissions: [
    'access_branch_services',
    'access_phone_banking',
    'access_assisted_digital',
    'view_account_details',
    'manage_fixed_deposits'
  ],
  influence: 'high',
  engagement: 'weekly',
  description: 'Long-term loyal customer who values personal relationships and needs assisted digital services'
})
export class LoyalSeniorCustomerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Active Senior Investor',
  persona: WilliamChenPersona,
  context: RetailBankingContext,
  goals: [
    'Manage investment portfolio actively',
    'Access wealth management services',
    'Use digital channels with senior-friendly UX',
    'Maintain relationship with personal advisor'
  ],
  responsibilities: [
    'Monitor investment portfolio',
    'Attend financial planning sessions',
    'Adopt new digital features gradually',
    'Provide feedback on senior UX'
  ],
  permissions: [
    'access_internet_banking',
    'access_mobile_app',
    'access_branch_services',
    'access_relationship_manager',
    'manage_investment_portfolio',
    'access_wealth_services'
  ],
  influence: 'high',
  engagement: 'weekly',
  description: 'Tech-curious senior with investment portfolio who wants senior-friendly digital experience'
})
export class ActiveSeniorInvestorStakeholder {}

// ============================================================================
// Family Customers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Family Primary Account Holder',
  persona: MariaSantosPersona,
  context: RetailBankingContext,
  goals: [
    'Manage joint family account',
    'Set up savings goals for children',
    'Access branch for complex needs',
    'Use digital for day-to-day transactions'
  ],
  responsibilities: [
    'Manage joint account with spouse',
    'Monitor family spending',
    'Set financial goals and budgets',
    'Teach children about banking'
  ],
  permissions: [
    'access_branch_services',
    'access_mobile_app',
    'manage_joint_account',
    'create_savings_goals',
    'setup_authorized_users',
    'access_financial_education'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Working parent managing family finances through mix of branch and digital channels'
})
export class FamilyPrimaryAccountHolderStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Branch-First Customer',
  persona: DavidEmmaFosterPersona,
  context: RetailBankingContext,
  goals: [
    'Personal service for important transactions',
    'Face-to-face advice for financial decisions',
    'Branch convenience for deposits/withdrawals',
    'Digital as supplement to branch'
  ],
  responsibilities: [
    'Visit branch for complex transactions',
    'Maintain relationship with branch staff',
    'Use digital for simple transactions',
    'Provide feedback on branch services'
  ],
  permissions: [
    'access_branch_services',
    'access_mobile_app',
    'access_relationship_manager',
    'request_in_person_advice',
    'manage_accounts'
  ],
  influence: 'medium',
  engagement: 'weekly',
  description: 'Customer who prefers branch interaction but is gradually adopting digital for convenience'
})
export class BranchFirstCustomerStakeholder {}
