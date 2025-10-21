/**
 * Retail Banking Context
 *
 * Front-office context for personal banking services including savings,
 * current accounts, debit cards, and personal loans.
 *
 * Owner: Robert Chang, Head of Retail Banking
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RiskComplianceContext } from './risk-compliance.context.js';
import { OperationsContext } from './operations.context.js';
import { TechnologyContext } from './technology.context.js';

@Context({
  name: 'Retail Banking',
  goals: [
    'Provide seamless personal banking experiences',
    'Maximize account opening conversion',
    'Increase digital adoption among retail customers',
    'Maintain high customer satisfaction (NPS > 60)'
  ],
  responsibilities: [
    'Personal savings and current accounts',
    'Debit card issuance and management',
    'Personal loans and overdrafts',
    'Account opening and KYC processes',
    'Customer onboarding and activation',
    'Branch and digital channel coordination'
  ],
  relationships: [
    {
      context: RiskComplianceContext,
      type: ContextRelationship.Downstream,
      description: 'Receives KYC verification and fraud screening results',
      exchanged: ['KYC status', 'fraud alerts', 'compliance clearance']
    },
    {
      context: OperationsContext,
      type: ContextRelationship.Peer,
      description: 'Coordinates on customer service and branch operations',
      exchanged: ['customer inquiries', 'service requests', 'branch metrics']
    },
    {
      context: TechnologyContext,
      type: ContextRelationship.Downstream,
      description: 'Consumes core banking and mobile app services',
      exchanged: ['account data', 'transaction history', 'system availability']
    }
  ],
  extensions: {
    backstory: 'Led by Robert Chang (49), who has 22 years at OgPgyBank and knows every branch personally',
    challenge: 'Digitizing services while maintaining human touch',
    philosophy: 'Branches aren\'t dying—they\'re evolving into advice centers'
  }
})
export class RetailBankingContext {}
