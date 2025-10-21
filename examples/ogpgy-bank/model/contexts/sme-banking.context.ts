/**
 * SME Banking Context
 *
 * Front-office context for Small & Medium Enterprise banking including
 * business accounts, lending, and merchant services.
 *
 * Owner: James Anderson, Head of SME Banking
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RetailBankingContext } from './retail-banking.context.js';
import { RiskComplianceContext } from './risk-compliance.context.js';
import { OperationsContext } from './operations.context.js';

@Context({
  name: 'SME Banking',
  goals: [
    'Be the banking partner for Genai SMEs, not just a bank',
    'Grow SME portfolio by 40% YoY',
    'Launch instant business account opening',
    'Provide integrated business + payment solutions'
  ],
  responsibilities: [
    'Business current and savings accounts',
    'Business lending and working capital',
    'Merchant services and payment processing',
    'Cash flow management tools',
    'Business KYC and UBO verification',
    'Payroll services'
  ],
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Peer,
      description: 'Coordinates on customers with both personal and business accounts',
      exchanged: ['customer profile', 'cross-sell opportunities', 'integrated views']
    },
    {
      context: RiskComplianceContext,
      type: ContextRelationship.Downstream,
      description: 'Receives enhanced due diligence for business accounts',
      exchanged: ['UBO verification', 'business KYC', 'credit risk assessment']
    },
    {
      context: OperationsContext,
      type: ContextRelationship.Downstream,
      description: 'Relies on payment processing and reconciliation',
      exchanged: ['payment transactions', 'merchant settlements', 'reconciliation reports']
    }
  ],
  extensions: {
    backstory: 'Led by James Anderson (44), former small business owner turned banker',
    innovation: 'Launched "Business in a Box" - instant business account + payment processing',
    philosophy: 'SMEs are the backbone of Genai\'s economy—they deserve banking partners, not just banks'
  }
})
export class SMEBankingContext {}
