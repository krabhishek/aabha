/**
 * Mobile Onboarding Journey - Steps
 *
 * All granular steps in the mobile onboarding journey.
 * Steps are independent entities referenced by Milestones.
 */

import { Step } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';

// ============================================================================
// STEPS (LEVEL 5: Granular actions, referenced by Milestones)
// ============================================================================

@Step({
  name: 'Download App from Store',
  actor: DigitalFirstCustomerStakeholder,
  order: 1
})
export class DownloadAppStep {}

@Step({
  name: 'Login with Existing Credentials',
  actor: DigitalFirstCustomerStakeholder,
  order: 2
})
export class LoginExistingStep {}

@Step({
  name: 'Set Up Biometric Authentication',
  actor: DigitalFirstCustomerStakeholder,
  order: 3
})
export class SetupBiometricStep {}

@Step({
  name: 'Link Accounts to App',
  actor: DigitalFirstCustomerStakeholder,
  order: 4
})
export class LinkAccountsStep {}

@Step({
  name: 'Complete Feature Tour',
  actor: DigitalFirstCustomerStakeholder,
  order: 5
})
export class FeatureTourStep {}

@Step({
  name: 'Enable Notifications',
  actor: DigitalFirstCustomerStakeholder,
  order: 6
})
export class EnableNotificationsStep {}
