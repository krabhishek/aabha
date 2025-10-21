/**
 * Account Opening Journey
 *
 * Transform from 5 days to 5 minutes through digital KYC and AI verification.
 * This is OgPgyBank's flagship digital transformation achievement.
 *
 * Primary Stakeholder: New customers (Marcus, Zara, Maria, etc.)
 * Participating: Customer, System (AI), Compliance Officer, Operations
 */

import { Journey } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder,
  StudentMobileUserStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  LoyalSeniorCustomerStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  FinanceOperationsManagerStakeholder
} from '../../../stakeholders/operations/employee-stakeholders.js';
import {
  AccountOpeningTime,
  CustomerEffortScore,
  NetPromoterScore
} from '../../../strategy/metrics.js';
import {
  EmailVerifiedMilestone,
  IdentityVerifiedMilestone,
  KYCApprovedMilestone,
  AccountCreatedMilestone,
  CardIssuedMilestone
} from './milestones.js';

// ============================================================================
// JOURNEY (LEVEL 3: User experience flow, aggregates Milestones)
// ============================================================================

@Journey({
  name: 'Account Opening Journey',
  primaryStakeholder: DigitalFirstCustomerStakeholder,
  slug: 'account-opening',
  milestones: [
    { milestone: EmailVerifiedMilestone, order: 1 },
    { milestone: IdentityVerifiedMilestone, order: 2 },
    { milestone: KYCApprovedMilestone, order: 3 },
    { milestone: AccountCreatedMilestone, order: 4 },
    { milestone: CardIssuedMilestone, order: 5 }
  ],
  participatingStakeholders: [
    DigitalFirstCustomerStakeholder,
    StudentMobileUserStakeholder,
    LoyalSeniorCustomerStakeholder,
    ChiefComplianceOfficerStakeholder,
    FinanceOperationsManagerStakeholder
  ],
  metrics: [
    AccountOpeningTime,      // 5 days → 5 minutes
    CustomerEffortScore,     // 3.2 → 1.8
    NetPromoterScore         // 42 → 65
  ],
  outcomes: [
    'Customer has active account with unique account number',
    'Virtual debit card issued and ready for transactions',
    'Physical card ordered (2-day delivery)',
    'Customer can immediately deposit funds and transact',
    'Full KYC compliance achieved'
  ],
  triggeringEvent: 'User clicks "Open Account" button',
  extensions: {
    backstory: 'Reduced from 5 days (7200 min) to 5 minutes - 99.93% improvement',
    achievement: '✅ Instant account opening live as of Q4 2024',
    metrics_detail: ['Account opening time: 5 min target', 'Conversion rate: 85%+', 'AI accuracy: 99.5%'],
    competitiveAdvantage: 'Fastest account opening in Genai - prevented customer loss to NeoBrightBank',
    targetPersonas: 'Marcus (young professional), Zara (student), Maria (working mother)'
  }
})
export class AccountOpeningJourney {}
