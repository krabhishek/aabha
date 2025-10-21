/**
 * Mobile Onboarding Journey - Milestones
 *
 * All business-significant milestones in the mobile onboarding journey.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  DownloadAppStep,
  LoginExistingStep,
  SetupBiometricStep,
  LinkAccountsStep,
  FeatureTourStep,
  EnableNotificationsStep
} from './steps.js';
import {
  TenMinuteOnboardingExpectation,
  SeamlessAuthenticationExpectation,
  AllAccountsVisibleExpectation,
  IntuitiveFeatureTourExpectation,
  NotificationPermissionExpectation
} from './expectations.js';

// ============================================================================
// MILESTONES (LEVEL 4: Business-significant achievements, aggregate Steps)
// ============================================================================

@Milestone({
  name: 'App Installed and Authenticated',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: DownloadAppStep, order: 1 },
    { step: LoginExistingStep, order: 2 },
    { step: SetupBiometricStep, order: 3 }
  ],
  expectations: [TenMinuteOnboardingExpectation, SeamlessAuthenticationExpectation],
  businessEvent: 'mobile.app.authenticated',
  stateful: true,
  reusable: false
})
export class AppAuthenticatedMilestone {}

@Milestone({
  name: 'Accounts Linked',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: LinkAccountsStep, order: 1 }
  ],
  expectations: [AllAccountsVisibleExpectation, TenMinuteOnboardingExpectation],
  businessEvent: 'mobile.accounts.linked',
  stateful: true,
  reusable: false
})
export class AccountsLinkedMilestone {}

@Milestone({
  name: 'Features Discovered',
  stakeholder: DigitalFirstCustomerStakeholder,
  steps: [
    { step: FeatureTourStep, order: 1 },
    { step: EnableNotificationsStep, order: 2 }
  ],
  expectations: [IntuitiveFeatureTourExpectation, NotificationPermissionExpectation],
  businessEvent: 'mobile.features.discovered',
  stateful: true,
  reusable: false
})
export class FeaturesDiscoveredMilestone {}
