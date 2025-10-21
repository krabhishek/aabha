/**
 * Funds Transfer Journey - Steps
 *
 * All granular steps in the funds transfer journey.
 * Steps are independent entities referenced by Milestones.
 */

import { Step } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';

// ============================================================================
// STEPS (LEVEL 5: Granular actions, referenced by Milestones)
// ============================================================================

@Step({
  name: 'Select Recipient',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 1
})
export class SelectRecipientStep {}

@Step({
  name: 'Enter Amount',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 2
})
export class EnterAmountStep {}

@Step({
  name: 'Review Transfer Details',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 3
})
export class ReviewTransferStep {}

@Step({
  name: 'Authenticate with Biometric',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 4
})
export class AuthenticateTransferStep {}

@Step({
  name: 'Fraud Check',
  actor: ChiefComplianceOfficerStakeholder,
  order: 5
})
export class FraudCheckStep {}

@Step({
  name: 'Process Transfer',
  actor: ChiefComplianceOfficerStakeholder,
  order: 6
})
export class ProcessTransferStep {}

@Step({
  name: 'Send Confirmation',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 7
})
export class SendConfirmationStep {}
