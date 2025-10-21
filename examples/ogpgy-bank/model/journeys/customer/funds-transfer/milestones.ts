/**
 * Funds Transfer Journey - Milestones
 *
 * All business-significant milestones in the funds transfer journey.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  SelectRecipientStep,
  EnterAmountStep,
  ReviewTransferStep,
  AuthenticateTransferStep,
  FraudCheckStep,
  ProcessTransferStep,
  SendConfirmationStep
} from './steps.js';
import {
  RealTimeTransferExpectation,
  FraudDetectionAccuracyExpectation,
  TransparentPricingExpectation,
  InstantConfirmationExpectation,
  BiometricAuthExpectation
} from './expectations.js';

// ============================================================================
// MILESTONES (LEVEL 4: Business-significant achievements, aggregate Steps)
// ============================================================================

@Milestone({
  name: 'Transfer Validated',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: SelectRecipientStep, order: 1 },
    { step: EnterAmountStep, order: 2 },
    { step: ReviewTransferStep, order: 3 }
  ],
  expectations: [RealTimeTransferExpectation, TransparentPricingExpectation],
  businessEvent: 'transfer.validated',
  stateful: true,
  reusable: true
})
export class TransferValidatedMilestone {}

@Milestone({
  name: 'Transfer Authorized',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: AuthenticateTransferStep, order: 1 },
    { step: FraudCheckStep, order: 2 }
  ],
  expectations: [BiometricAuthExpectation, FraudDetectionAccuracyExpectation],
  businessEvent: 'transfer.authorized',
  stateful: true,
  reusable: true
})
export class TransferAuthorizedMilestone {}

@Milestone({
  name: 'Transfer Completed',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: ProcessTransferStep, order: 1 },
    { step: SendConfirmationStep, order: 2 }
  ],
  expectations: [RealTimeTransferExpectation, InstantConfirmationExpectation],
  businessEvent: 'transfer.completed',
  stateful: true,
  reusable: true
})
export class TransferCompletedMilestone {}
