/**
 * Operations Context
 *
 * Back-office context for payment processing, reconciliation,
 * customer service, and branch network operations.
 *
 * Owners: Priya Sharma (COO), Thomas Murphy (Head of Finance Operations)
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RetailBankingContext } from './retail-banking.context.js';
import { SMEBankingContext } from './sme-banking.context.js';
import { RiskComplianceContext } from './risk-compliance.context.js';
import { TechnologyContext } from './technology.context.js';

@Context({
  name: 'Operations',
  goals: [
    'Operational excellence creates capacity for innovation',
    'Real-time payment processing (T+2 → real-time)',
    'Reduce operational costs by 15% through automation',
    'Transform branches into advice centers',
    '99.9% system uptime and availability'
  ],
  responsibilities: [
    'Payment processing and settlement',
    'Transaction reconciliation',
    'Customer service centers (call, email, chat)',
    'Branch network operations (247 branches)',
    'ATM and cash management',
    'Document management and archival',
    'Operational reporting and analytics'
  ],
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Peer,
      description: 'Coordinates on customer service and branch operations',
      exchanged: ['customer inquiries', 'service requests', 'operational metrics']
    },
    {
      context: SMEBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Provides payment processing and merchant settlements',
      exchanged: ['payment transactions', 'settlements', 'reconciliation reports']
    },
    {
      context: RiskComplianceContext,
      type: ContextRelationship.Peer,
      description: 'Coordinates on transaction monitoring and audit trails',
      exchanged: ['transaction logs', 'audit trails', 'suspicious activity flags']
    },
    {
      context: TechnologyContext,
      type: ContextRelationship.Downstream,
      description: 'Consumes core banking systems and automation tools',
      exchanged: ['system status', 'transaction data', 'automation workflows']
    }
  ],
  extensions: {
    backstory: 'Led by Priya Sharma (COO, 45) - 20 years at OgPgyBank, started as branch manager. Philosophy: "Operations excellence is customer love made systematic"',
    achievement: 'Reduced payment processing from T+2 to real-time',
    transformation: 'Branch digitization Phase 2 of 4 - evolving from transactional to advisory centers'
  }
})
export class OperationsContext {}
