/**
 * Retail Banking - System Stakeholders
 *
 * Systems and platforms supporting retail banking operations including
 * core banking, branch management, and savings automation.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RetailBankingContext } from '../../contexts/retail-banking.context.js';
import {
  CoreBankingPlatformPersona,
  MobileAppBackendServicePersona
} from '../../personas/system/core-banking.persona.js';

// ============================================================================
// Core Banking Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Savings Account Manager',
  persona: CoreBankingPlatformPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Create and manage savings accounts',
    'Calculate and post interest',
    'Enforce minimum balance rules',
    'Process deposits and withdrawals',
    'Generate account statements',
    'Send balance update events'
  ],
  permissions: [
    'create_savings_account',
    'update_balance',
    'calculate_interest',
    'post_interest',
    'generate_statements',
    'publish_account_events'
  ],
  description: 'Core banking system managing savings account lifecycle and operations'
})
export class SavingsAccountManagerStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Transaction Processor',
  persona: CoreBankingPlatformPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Process deposits and withdrawals',
    'Execute fund transfers',
    'Validate transaction limits',
    'Update account balances in real-time',
    'Generate transaction records',
    'Send transaction notifications'
  ],
  permissions: [
    'process_transactions',
    'update_balances',
    'validate_limits',
    'write_transaction_log',
    'send_notifications',
    'publish_transaction_events'
  ],
  description: 'Transaction processing engine handling all retail banking transactions'
})
export class TransactionProcessorStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Branch Management System',
  persona: CoreBankingPlatformPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Track branch operations and metrics',
    'Manage teller cash drawers',
    'Schedule branch appointments',
    'Route customer service requests',
    'Generate branch performance reports',
    'Coordinate branch-digital handoffs'
  ],
  permissions: [
    'manage_branch_operations',
    'track_teller_cash',
    'schedule_appointments',
    'route_service_requests',
    'generate_reports',
    'coordinate_channels'
  ],
  description: 'Branch management platform coordinating physical branch operations with digital channels'
})
export class BranchManagementSystemStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Savings Goals Engine',
  persona: MobileAppBackendServicePersona,
  context: RetailBankingContext,
  responsibilities: [
    'Create and track savings goals',
    'Calculate progress and projections',
    'Automate periodic transfers to goals',
    'Send milestone notifications',
    'Provide AI-powered savings recommendations',
    'Visualize goal progress'
  ],
  permissions: [
    'create_savings_goals',
    'calculate_projections',
    'initiate_auto_transfers',
    'send_notifications',
    'access_transaction_history',
    'generate_recommendations'
  ],
  description: 'AI-powered savings goal tracking and automation engine helping customers save smarter'
})
export class SavingsGoalsEngineStakeholder {}
