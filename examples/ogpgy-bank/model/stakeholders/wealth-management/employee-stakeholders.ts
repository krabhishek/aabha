/**
 * Wealth Management - Employee Stakeholders
 *
 * Wealth advisors and portfolio managers serving affluent customers.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { WealthManagementContext } from '../../contexts/wealth-management.context.js';
import {
  SophiaMartinezPersona
} from '../../personas/human/employees/front-office.persona.js';

// ============================================================================
// Wealth Advisory Team
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Wealth Advisor',
  persona: SophiaMartinezPersona,
  context: WealthManagementContext,
  goals: [
    'Democratize wealth management for mass affluent',
    'Grow assets under management',
    'Provide personalized financial advice',
    'Build long-term client relationships'
  ],
  responsibilities: [
    'Provide investment advisory services',
    'Create personalized financial plans',
    'Manage client portfolios',
    'Conduct financial planning sessions',
    'Recommend investment products',
    'Monitor portfolio performance',
    'Ensure suitability and compliance'
  ],
  permissions: [
    'access_client_financial_data',
    'recommend_investments',
    'create_financial_plans',
    'manage_client_portfolios',
    'access_wealth_platform',
    'approve_investment_transactions'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Wealth advisor providing personalized financial planning and investment advice to affluent clients'
})
export class WealthAdvisorStakeholder {}
