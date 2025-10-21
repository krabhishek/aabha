/**
 * SME Banking - System Stakeholders
 *
 * Systems supporting SME banking including merchant services,
 * business account management, and lending platforms.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { SMEBankingContext } from '../../contexts/sme-banking.context.js';
import {
  CoreBankingPlatformPersona
} from '../../personas/system/core-banking.persona.js';
import {
  PaymentGatewayServicePersona
} from '../../personas/system/payment-card.persona.js';

// ============================================================================
// Business Banking Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Business Account Manager',
  persona: CoreBankingPlatformPersona,
  context: SMEBankingContext,
  responsibilities: [
    'Create and manage business accounts',
    'Handle multi-user account access',
    'Process high-volume business transactions',
    'Generate business account statements',
    'Manage account permissions and roles',
    'Track business account analytics'
  ],
  permissions: [
    'create_business_account',
    'manage_account_users',
    'process_business_transactions',
    'generate_statements',
    'configure_permissions',
    'provide_account_analytics'
  ],
  description: 'Business account management platform handling SME account lifecycle and operations'
})
export class BusinessAccountManagerStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Merchant Services Platform',
  persona: PaymentGatewayServicePersona,
  context: SMEBankingContext,
  responsibilities: [
    'Process merchant payments',
    'Provide payment gateway APIs',
    'Handle card payment acceptance',
    'Manage merchant settlements',
    'Provide payment analytics',
    'Support multiple payment methods'
  ],
  permissions: [
    'process_merchant_payments',
    'settle_merchant_accounts',
    'provide_payment_apis',
    'generate_payment_analytics',
    'manage_payment_methods',
    'handle_chargebacks'
  ],
  description: 'Merchant services platform enabling SMEs to accept customer payments'
})
export class MerchantServicesPlatformStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Business Lending Engine',
  persona: CoreBankingPlatformPersona,
  context: SMEBankingContext,
  responsibilities: [
    'Process business loan applications',
    'Perform credit scoring',
    'Manage loan lifecycle',
    'Calculate and process repayments',
    'Provide flexible credit lines',
    'Generate lending reports'
  ],
  permissions: [
    'process_loan_applications',
    'perform_credit_checks',
    'approve_credit_lines',
    'manage_loan_accounts',
    'calculate_interest',
    'generate_lending_reports'
  ],
  description: 'Business lending platform providing loans and credit lines to SME customers'
})
export class BusinessLendingEngineStakeholder {}
