/**
 * Wealth Management Context
 *
 * Front-office context for investment products, financial planning,
 * and advisory services.
 *
 * Owner: Sophia Martinez, Head of Wealth Management
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RetailBankingContext } from './retail-banking.context.js';
import { RiskComplianceContext } from './risk-compliance.context.js';
import { TechnologyContext } from './technology.context.js';

@Context({
  name: 'Wealth Management',
  goals: [
    'Democratize wealth management for mass affluent, not just ultra-rich',
    'Grow AUM by 30% YoY',
    'Launch digital wealth platform Q1 2025',
    'Provide personalized investment advice at scale'
  ],
  responsibilities: [
    'Investment portfolio management',
    'Financial planning and advisory',
    'Investment products (funds, bonds, equities)',
    'Retirement planning',
    'Estate planning coordination',
    'Risk profiling and asset allocation'
  ],
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Receives referrals from retail banking for affluent customers',
      exchanged: ['customer referrals', 'account balances', 'savings patterns']
    },
    {
      context: RiskComplianceContext,
      type: ContextRelationship.Downstream,
      description: 'Receives suitability and compliance checks for investments',
      exchanged: ['suitability assessments', 'regulatory compliance', 'risk limits']
    },
    {
      context: TechnologyContext,
      type: ContextRelationship.Downstream,
      description: 'Consumes wealth management platform and AI advisory services',
      exchanged: ['portfolio data', 'market data', 'AI recommendations']
    }
  ],
  extensions: {
    backstory: 'Led by Sophia Martinez (46), private banker from UBS with CFP certification',
    platform: 'Wealth management platform planned for Q1 2025 launch',
    philosophy: 'Wealth management should be accessible to all, not just the ultra-rich'
  }
})
export class WealthManagementContext {}
