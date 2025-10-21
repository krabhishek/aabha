/**
 * Risk & Compliance Context
 *
 * Middle-office context for risk management, regulatory compliance,
 * fraud detection, and AML/KYC processes.
 *
 * Owners: Elena Rodriguez (CRO), Dr. Kenji Yamamoto (CCO)
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RetailBankingContext } from './retail-banking.context.js';
import { SMEBankingContext } from './sme-banking.context.js';
import { WealthManagementContext } from './wealth-management.context.js';
import { OperationsContext } from './operations.context.js';
import { TechnologyContext } from './technology.context.js';

@Context({
  name: 'Risk & Compliance',
  goals: [
    'Real-time risk monitoring and fraud detection (95% detection rate)',
    'Zero critical compliance incidents',
    'Proactive regulatory compliance',
    'Transform compliance from blocker to enabler',
    'Risk management is about saying "yes" safely'
  ],
  responsibilities: [
    'KYC and AML screening',
    'Real-time fraud detection and prevention',
    'Regulatory compliance and reporting',
    'Credit risk assessment',
    'Operational risk monitoring',
    'Internal controls and audit',
    'Policy framework and governance'
  ],
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Provides KYC verification and fraud screening for retail accounts',
      exchanged: ['KYC results', 'fraud alerts', 'risk scores', 'compliance clearance']
    },
    {
      context: SMEBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Provides enhanced due diligence for business accounts',
      exchanged: ['UBO verification', 'business KYC', 'credit assessments', 'risk ratings']
    },
    {
      context: WealthManagementContext,
      type: ContextRelationship.Upstream,
      description: 'Provides suitability and compliance checks for investments',
      exchanged: ['suitability assessments', 'regulatory limits', 'risk approvals']
    },
    {
      context: OperationsContext,
      type: ContextRelationship.Peer,
      description: 'Coordinates on transaction monitoring and reconciliation',
      exchanged: ['transaction alerts', 'suspicious activity reports', 'audit trails']
    },
    {
      context: TechnologyContext,
      type: ContextRelationship.Downstream,
      description: 'Consumes AI fraud detection and real-time monitoring systems',
      exchanged: ['fraud predictions', 'anomaly detections', 'compliance dashboards']
    }
  ],
  extensions: {
    backstory: 'Led by Elena Rodriguez (CRO, 50) - former bank supervisor at Genai Central Bank, and Dr. Kenji Yamamoto (CCO, 55) - 25 years in banking regulation',
    transformation: 'From 78% to 95% fraud detection rate through AI and real-time monitoring',
    philosophy: 'Risk management is about saying "yes" safely, not just saying "no"'
  }
})
export class RiskComplianceContext {}
