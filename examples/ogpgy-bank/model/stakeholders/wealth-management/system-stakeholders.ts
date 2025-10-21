/**
 * Wealth Management - System Stakeholders
 *
 * Systems supporting wealth management including portfolio management,
 * robo-advisory, and investment platforms.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { WealthManagementContext } from '../../contexts/wealth-management.context.js';
import {
  CoreBankingPlatformPersona
} from '../../personas/system/core-banking.persona.js';

// ============================================================================
// Wealth Management Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Portfolio Management Platform',
  persona: CoreBankingPlatformPersona,
  context: WealthManagementContext,
  responsibilities: [
    'Manage client investment portfolios',
    'Track portfolio performance',
    'Rebalance portfolios automatically',
    'Calculate returns and risk metrics',
    'Generate performance reports',
    'Execute trade orders'
  ],
  permissions: [
    'manage_portfolios',
    'execute_trades',
    'access_market_data',
    'calculate_performance',
    'rebalance_assets',
    'generate_reports'
  ],
  description: 'Portfolio management platform tracking and optimizing client investment portfolios'
})
export class PortfolioManagementPlatformStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Robo-Advisory Engine',
  persona: CoreBankingPlatformPersona,
  context: WealthManagementContext,
  responsibilities: [
    'Provide automated investment advice',
    'Create personalized portfolio recommendations',
    'Assess client risk tolerance',
    'Generate financial plans',
    'Automate portfolio rebalancing',
    'Provide investment education'
  ],
  permissions: [
    'analyze_client_profile',
    'generate_recommendations',
    'create_portfolios',
    'automate_rebalancing',
    'provide_financial_planning',
    'track_goals'
  ],
  description: 'AI-powered robo-advisory platform providing automated investment advice for mass affluent'
})
export class RoboAdvisoryEngineStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Investment Products Platform',
  persona: CoreBankingPlatformPersona,
  context: WealthManagementContext,
  responsibilities: [
    'Offer investment products (funds, bonds, stocks)',
    'Manage product catalog',
    'Process investment transactions',
    'Track product performance',
    'Provide product information',
    'Ensure regulatory compliance'
  ],
  permissions: [
    'manage_product_catalog',
    'process_investments',
    'track_performance',
    'provide_product_data',
    'ensure_suitability',
    'generate_disclosures'
  ],
  description: 'Investment product platform offering and managing various investment vehicles'
})
export class InvestmentProductsPlatformStakeholder {}
