/**
 * Operations - System Stakeholders
 *
 * Systems supporting operations including payment processing,
 * reconciliation, and treasury management.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { OperationsContext } from '../../contexts/operations.context.js';
import {
  PaymentGatewayServicePersona
} from '../../personas/system/payment-card.persona.js';
import {
  CoreBankingPlatformPersona
} from '../../personas/system/core-banking.persona.js';

// ============================================================================
// Operations Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Payment Processing Engine',
  persona: PaymentGatewayServicePersona,
  context: OperationsContext,
  responsibilities: [
    'Process domestic and international payments',
    'Handle SWIFT transfers',
    'Process ACH batch payments',
    'Execute real-time payments',
    'Track payment status',
    'Handle payment returns and failures'
  ],
  permissions: [
    'process_payments',
    'access_payment_rails',
    'send_swift_messages',
    'process_ach_batches',
    'update_payment_status',
    'handle_payment_returns'
  ],
  description: 'Payment processing engine handling all domestic and international money transfers'
})
export class PaymentProcessingEngineStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Reconciliation System',
  persona: CoreBankingPlatformPersona,
  context: OperationsContext,
  responsibilities: [
    'Reconcile transactions across systems',
    'Identify discrepancies',
    'Generate reconciliation reports',
    'Track unmatched transactions',
    'Automate reconciliation workflows',
    'Alert on exceptions'
  ],
  permissions: [
    'access_all_transaction_data',
    'match_transactions',
    'generate_reports',
    'flag_discrepancies',
    'create_reconciliation_cases',
    'access_multiple_systems'
  ],
  description: 'Automated reconciliation system ensuring transaction accuracy across all banking systems'
})
export class ReconciliationSystemStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Treasury Management System',
  persona: CoreBankingPlatformPersona,
  context: OperationsContext,
  responsibilities: [
    'Monitor bank liquidity in real-time',
    'Manage funding sources',
    'Calculate capital ratios',
    'Model interest rate risk',
    'Generate treasury reports',
    'Interface with Central Bank systems'
  ],
  permissions: [
    'access_liquidity_data',
    'monitor_capital_ratios',
    'model_alm',
    'access_market_data',
    'generate_treasury_reports',
    'interface_with_central_bank'
  ],
  description: 'Treasury management system optimizing bank liquidity and managing financial risk'
})
export class TreasuryManagementSystemStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Financial Reporting Engine',
  persona: CoreBankingPlatformPersona,
  context: OperationsContext,
  responsibilities: [
    'Generate financial statements',
    'Produce regulatory reports',
    'Calculate financial metrics',
    'Aggregate operational data',
    'Ensure reporting compliance',
    'Provide management dashboards'
  ],
  permissions: [
    'access_all_financial_data',
    'generate_reports',
    'calculate_metrics',
    'aggregate_data',
    'submit_regulatory_reports',
    'provide_dashboards'
  ],
  description: 'Financial reporting engine generating statements and regulatory reports for management and regulators'
})
export class FinancialReportingEngineStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Learning Management System',
  persona: CoreBankingPlatformPersona,
  context: OperationsContext,
  responsibilities: [
    'Provide digital training modules',
    'Track employee training progress',
    'Assess proficiency levels',
    'Generate training certificates',
    'Deliver onboarding programs',
    'Monitor skill gaps'
  ],
  permissions: [
    'access_training_content',
    'track_employee_progress',
    'assess_proficiency',
    'issue_certificates',
    'generate_training_reports',
    'manage_learning_paths'
  ],
  description: 'Learning management system delivering digital training and tracking employee development'
})
export class LearningManagementSystemStakeholder {}
