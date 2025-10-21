/**
 * Account Opening Journey - Steps
 *
 * All granular steps in the account opening journey.
 * Steps are independent entities that are referenced by Milestones.
 * Steps do NOT reference Expectations - the hierarchy flows parent → child only.
 */

import { Step } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  FinanceOperationsManagerStakeholder
} from '../../../stakeholders/operations/employee-stakeholders.js';

// ============================================================================
// STEPS (LEVEL 5: Granular actions, referenced by Milestones)
// ============================================================================

@Step({
  name: 'Enter Email and Create Password',
  actor: DigitalFirstCustomerStakeholder,
  order: 1
})
export class EnterEmailPasswordStep {}

@Step({
  name: 'Verify Email Address',
  actor: DigitalFirstCustomerStakeholder,
  order: 2
})
export class VerifyEmailStep {}

@Step({
  name: 'Enter Personal Information',
  actor: DigitalFirstCustomerStakeholder,
  order: 3
})
export class EnterPersonalInfoStep {}

@Step({
  name: 'Upload ID Document',
  actor: DigitalFirstCustomerStakeholder,
  order: 4
})
export class UploadIDDocumentStep {}

@Step({
  name: 'AI Document Verification',
  actor: FinanceOperationsManagerStakeholder, // System actor
  order: 5
})
export class AIDocumentVerificationStep {}

@Step({
  name: 'KYC Check with Central Bank',
  actor: ChiefComplianceOfficerStakeholder,
  order: 6
})
export class KYCCentralBankCheckStep {}

@Step({
  name: 'Manual Review (if needed)',
  actor: ChiefComplianceOfficerStakeholder,
  order: 7
})
export class ManualReviewStep {}

@Step({
  name: 'Create Account in Core Banking',
  actor: FinanceOperationsManagerStakeholder,
  order: 8
})
export class CreateAccountCoreStep {}

@Step({
  name: 'Issue Virtual Debit Card',
  actor: FinanceOperationsManagerStakeholder,
  order: 9
})
export class IssueVirtualCardStep {}

@Step({
  name: 'Order Physical Card',
  actor: FinanceOperationsManagerStakeholder,
  order: 10
})
export class OrderPhysicalCardStep {}

@Step({
  name: 'Notify Customer of Success',
  actor: FinanceOperationsManagerStakeholder,
  order: 11
})
export class NotifyCustomerSuccessStep {}
