/**
 * Funds Transfer Journey
 *
 * Send money to another person or pay bills - must be fast, secure, and transparent.
 * Real-time processing (was T+2).
 */

import { Journey } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  DigitalFirstCustomerStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  PaymentProcessingTime,
  FraudDetectionRate
} from '../../../strategy/metrics.js';
import {
  TransferValidatedMilestone,
  TransferAuthorizedMilestone,
  TransferCompletedMilestone
} from './milestones.js';

// ============================================================================
// JOURNEY (LEVEL 3: User experience flow, aggregates Milestones)
// ============================================================================

@Journey({
  name: 'Funds Transfer Journey',
  primaryStakeholder: FamilyPrimaryAccountHolderStakeholder,
  slug: 'funds-transfer',
  milestones: [
    { milestone: TransferValidatedMilestone, order: 1 },
    { milestone: TransferAuthorizedMilestone, order: 2 },
    { milestone: TransferCompletedMilestone, order: 3 }
  ],
  participatingStakeholders: [
    FamilyPrimaryAccountHolderStakeholder,
    DigitalFirstCustomerStakeholder,
    ChiefComplianceOfficerStakeholder
  ],
  metrics: [
    PaymentProcessingTime,     // T+2 → Real-time
    FraudDetectionRate         // 78% → 95%
  ],
  outcomes: [
    'Funds transferred successfully',
    'Both parties notified',
    'Real-time balance update',
    'Fraud check completed',
    'Transaction recorded securely'
  ],
  triggeringEvent: 'User clicks "Transfer Money"',
  extensions: {
    achievement: 'Real-time processing (was T+2)',
    targetPersonas: 'Maria (bill payments), Elena (remittances)',
    securityFeatures: 'Biometric auth, real-time fraud detection, transaction limits'
  }
})
export class FundsTransferJourney {}
