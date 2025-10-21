/**
 * Operations - Employee Stakeholders
 *
 * Operations staff managing payments processing, reconciliation,
 * and financial operations.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { OperationsContext } from '../../contexts/operations.context.js';
import {
  ThomasMurphyPersona,
  NadiaHassanPersona
} from '../../personas/human/employees/middle-back-office.persona.js';

// ============================================================================
// Operations Team
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Finance Operations Manager',
  persona: ThomasMurphyPersona,
  context: OperationsContext,
  goals: [
    'Achieve operational excellence',
    'Reduce payment processing time',
    'Automate reconciliation processes',
    'Reduce operational costs by 15%'
  ],
  responsibilities: [
    'Oversee payments processing',
    'Manage reconciliation workflows',
    'Ensure operational SLAs',
    'Optimize process efficiency',
    'Manage vendor relationships',
    'Track operational metrics'
  ],
  permissions: [
    'access_operations_dashboards',
    'manage_payment_workflows',
    'approve_process_changes',
    'access_reconciliation_system',
    'manage_vendor_contracts',
    'override_operational_limits'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Operations manager driving efficiency in payments processing and reconciliation'
})
export class FinanceOperationsManagerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Treasury Manager',
  persona: NadiaHassanPersona,
  context: OperationsContext,
  goals: [
    'Optimize liquidity management',
    'Fund growth initiatives',
    'Manage interest rate risk',
    'Maintain regulatory capital requirements'
  ],
  responsibilities: [
    'Manage bank liquidity',
    'Monitor funding sources',
    'Manage capital allocation',
    'Handle interest rate risk',
    'Ensure regulatory compliance',
    'Coordinate with Central Bank'
  ],
  permissions: [
    'access_treasury_systems',
    'manage_liquidity',
    'allocate_capital',
    'access_alm_models',
    'trade_market_instruments',
    'access_central_bank_facilities'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Treasury manager optimizing bank liquidity and funding to support business growth'
})
export class TreasuryManagerStakeholder {}
