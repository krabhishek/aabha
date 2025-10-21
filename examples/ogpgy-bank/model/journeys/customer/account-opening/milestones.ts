/**
 * Account Opening Journey - Milestones
 *
 * All business-significant milestones in the account opening journey.
 * Milestones aggregate Steps and link to Expectations.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  EnterEmailPasswordStep,
  VerifyEmailStep,
  EnterPersonalInfoStep,
  UploadIDDocumentStep,
  AIDocumentVerificationStep,
  KYCCentralBankCheckStep,
  ManualReviewStep,
  CreateAccountCoreStep,
  IssueVirtualCardStep,
  OrderPhysicalCardStep,
  NotifyCustomerSuccessStep
} from './steps.js';
import {
  FiveMinuteAccountOpeningExpectation,
  AIVerificationAccuracyExpectation,
  InstantVirtualCardExpectation
} from './expectations.js';

// ============================================================================
// MILESTONES (LEVEL 4: Business-significant achievements, aggregate Steps)
// ============================================================================

@Milestone({
  name: 'Email Verified',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: EnterEmailPasswordStep, order: 1 },
    { step: VerifyEmailStep, order: 2 }
  ],
  expectations: [FiveMinuteAccountOpeningExpectation],
  businessEvent: 'account.email.verified',
  stateful: true,
  reusable: true
})
export class EmailVerifiedMilestone {}

@Milestone({
  name: 'Identity Verified',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: EnterPersonalInfoStep, order: 1 },
    { step: UploadIDDocumentStep, order: 2 },
    { step: AIDocumentVerificationStep, order: 3 },
    { step: KYCCentralBankCheckStep, order: 4 }
  ],
  expectations: [AIVerificationAccuracyExpectation, FiveMinuteAccountOpeningExpectation],
  businessEvent: 'account.identity.verified',
  stateful: true,
  reusable: true
})
export class IdentityVerifiedMilestone {}

@Milestone({
  name: 'KYC Approved',
  stakeholder: ChiefComplianceOfficerStakeholder,
  steps: [
    { step: KYCCentralBankCheckStep, order: 1 },
    { step: ManualReviewStep, order: 2 } // Conditional
  ],
  expectations: [AIVerificationAccuracyExpectation],
  businessEvent: 'account.kyc.approved',
  stateful: true,
  reusable: true
})
export class KYCApprovedMilestone {}

@Milestone({
  name: 'Account Created',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: CreateAccountCoreStep, order: 1 },
    { step: NotifyCustomerSuccessStep, order: 2 }
  ],
  expectations: [FiveMinuteAccountOpeningExpectation],
  businessEvent: 'account.created',
  stateful: true,
  reusable: false
})
export class AccountCreatedMilestone {}

@Milestone({
  name: 'Card Issued',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: IssueVirtualCardStep, order: 1 },
    { step: OrderPhysicalCardStep, order: 2 }
  ],
  expectations: [InstantVirtualCardExpectation],
  businessEvent: 'account.card.issued',
  stateful: true,
  reusable: true
})
export class CardIssuedMilestone {}
