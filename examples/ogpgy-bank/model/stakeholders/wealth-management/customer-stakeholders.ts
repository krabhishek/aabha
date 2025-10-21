/**
 * Wealth Management - Customer Stakeholders
 *
 * Affluent and high net worth customers seeking investment advice,
 * portfolio management, and wealth planning services.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { WealthManagementContext } from '../../contexts/wealth-management.context.js';
import {
  VictoriaZhangPersona,
  RichardBlackwoodPersona,
  DrAliciaFernandezPersona
} from '../../personas/human/customers/affluent.persona.js';

// ============================================================================
// Wealth Management Customers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'High Net Worth Individual',
  persona: VictoriaZhangPersona,
  context: WealthManagementContext,
  goals: [
    'Grow and preserve wealth across generations',
    'Receive sophisticated financial advice',
    'Access exclusive investment opportunities',
    'Plan estate and wealth transfer',
    'Get concierge banking services globally'
  ],
  responsibilities: [
    'Maintain wealth management relationship',
    'Provide financial goals and risk tolerance',
    'Review portfolio performance regularly',
    'Engage with dedicated wealth advisor',
    'Update estate planning as needed'
  ],
  permissions: [
    'access_wealth_advisory',
    'access_exclusive_investments',
    'access_concierge_services',
    'manage_multi_currency_accounts',
    'access_credit_facilities',
    'access_estate_planning'
  ],
  influence: 'high',
  engagement: 'weekly',
  description: 'HNWI customer expecting proactive advice, exclusive access, and personalized wealth management'
})
export class HighNetWorthIndividualStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Business Executive Investor',
  persona: RichardBlackwoodPersona,
  context: WealthManagementContext,
  goals: [
    'Optimize portfolio for tax efficiency',
    'Plan for retirement with spouse',
    'Manage wealth without excessive time commitment',
    'Get expert advice while maintaining control'
  ],
  responsibilities: [
    'Define investment goals and constraints',
    'Review advisor recommendations',
    'Approve portfolio changes',
    'Attend quarterly review sessions',
    'Provide tax planning information'
  ],
  permissions: [
    'access_portfolio_management',
    'access_tax_optimization',
    'access_wealth_advisor',
    'manage_trust_services',
    'access_mortgage_services',
    'video_advisory_sessions'
  ],
  influence: 'high',
  engagement: 'monthly',
  description: 'Time-poor executive needing efficient wealth management with digital tools and expert human advice'
})
export class BusinessExecutiveInvestorStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mass Affluent Professional',
  persona: DrAliciaFernandezPersona,
  context: WealthManagementContext,
  goals: [
    'Build wealth for early retirement',
    'Fund children\'s international education',
    'Learn investment strategies',
    'Diversify beyond savings accounts'
  ],
  responsibilities: [
    'Set financial goals',
    'Complete risk profiling',
    'Review investment recommendations',
    'Monitor portfolio performance',
    'Participate in financial education'
  ],
  permissions: [
    'access_robo_advisory',
    'access_video_advisory',
    'access_education_planning',
    'access_retirement_planning',
    'access_investment_products',
    'access_financial_education'
  ],
  influence: 'medium',
  engagement: 'monthly',
  description: 'Mass affluent professional seeking democratized wealth management and investment education'
})
export class MassAffluentProfessionalStakeholder {}
