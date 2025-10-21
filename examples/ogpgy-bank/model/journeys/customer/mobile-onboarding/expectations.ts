/**
 * Mobile Onboarding Journey - Expectations
 *
 * All stakeholder expectations for mobile onboarding.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder,
  StudentMobileUserStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  MobileAppBackendServiceStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';
import {
  DownloadInstallAppBehavior,
  ValidateLoginCredentialsBehavior,
  SetupBiometricAuthBehavior,
  LinkAccountsBehavior,
  CompleteFeatureTourBehavior,
  EnableNotificationsBehavior,
  CompleteOnboardingTimelyBehavior
} from './behaviors.js';

// ============================================================================
// EXPECTATIONS (LEVEL 6: What stakeholders expect, implemented by Behaviors)
// ============================================================================

@Expectation({
  name: 'Ten Minute Onboarding',
  description: 'Given first-time app user, When onboarding, Then complete within 10 minutes',
  provider: MobileAppBackendServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Existing account credentials (username/email and password)',
      'Biometric data (fingerprint or face ID) for authentication setup',
      'Notification permission request',
      'Feature tour preferences'
    ],
    outputs: [
      'Authenticated session token',
      'Linked account details with balances',
      'Configured app preferences',
      'Feature tour completion status',
      'Push notification token (if enabled)'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Customer has existing OgPgyBank account',
      'Mobile app installed on device',
      'Device supports biometric authentication',
      'Internet connectivity available'
    ],
    postconditions: [
      'User authenticated successfully',
      'All customer accounts linked and visible',
      'Biometric authentication configured (if opted in)',
      'Feature tour completed or skipped',
      'App ready for first transaction'
    ],
    constraints: {
      maxLatency: '< 10 minutes total onboarding time (target: 5 minutes)',
      availability: '99.9%',
      security: ['Biometric data stored locally on device only', 'Session token encrypted with AES-256'],
      throughput: '500 concurrent onboarding users'
    }
  },
  behaviors: [
    DownloadInstallAppBehavior,
    ValidateLoginCredentialsBehavior,
    SetupBiometricAuthBehavior,
    LinkAccountsBehavior,
    CompleteFeatureTourBehavior,
    CompleteOnboardingTimelyBehavior
  ],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Download to first transaction ≤ 10 minutes',
    'Biometric setup optional but encouraged',
    'Clear value proposition shown',
    'Key features discovered'
  ],
  businessValue: 'Fast onboarding increases activation and reduces abandonment'
})
export class TenMinuteOnboardingExpectation {}

@Expectation({
  name: 'Seamless Authentication',
  description: 'Given existing customer, When logging in, Then seamless authentication',
  provider: MobileAppBackendServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Username or email address',
      'Password',
      'Device information (for security)',
      'Biometric enrollment data (optional)'
    ],
    outputs: [
      'Authentication result (success/failure)',
      'Session token (JWT)',
      'User profile data',
      'Biometric authentication status',
      'Security challenge if needed (2FA)'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Customer has existing account with OgPgyBank',
      'Credentials are valid and not expired',
      'Account is not locked or suspended',
      'Mobile backend service is available'
    ],
    postconditions: [
      'User authenticated and session established',
      'Biometric authentication configured (if opted in)',
      'Audit log entry created',
      'Failed login attempts tracked'
    ],
    constraints: {
      maxLatency: '< 2 seconds for credential validation, < 1 minute for biometric setup',
      availability: '99.95%',
      security: ['Password transmitted over TLS 1.3', 'Failed login rate limiting after 3 attempts', 'Biometric data never leaves device'],
      throughput: '1000 concurrent login attempts'
    }
  },
  behaviors: [ValidateLoginCredentialsBehavior, SetupBiometricAuthBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Existing credentials work immediately',
    'Biometric setup in < 1 minute',
    'Clear error messages for failed login',
    'Password reset available'
  ],
  businessValue: 'Seamless login reduces friction and builds trust'
})
export class SeamlessAuthenticationExpectation {}

@Expectation({
  name: 'All Accounts Visible',
  description: 'Given multiple accounts, When linking, Then all accounts visible',
  provider: MobileAppBackendServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Authenticated user session token',
      'Customer ID',
      'Account refresh request'
    ],
    outputs: [
      'List of all customer accounts (savings, checking, credit)',
      'Current balance for each account',
      'Account status (active, dormant, frozen)',
      'Recent transactions summary',
      'Account metadata (opening date, account type, etc.)'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Customer is authenticated',
      'Customer has at least one active account',
      'Core banking system is accessible',
      'Account data is synchronized'
    ],
    postconditions: [
      'All accounts displayed in mobile app',
      'Balances are accurate and up-to-date',
      'User can switch between accounts easily',
      'Account linking status cached locally'
    ],
    constraints: {
      maxLatency: '< 3 seconds for account data retrieval',
      availability: '99.9%',
      security: ['Account data encrypted in transit and at rest', 'Access control based on customer ownership'],
      throughput: '800 concurrent account link requests'
    }
  },
  behaviors: [LinkAccountsBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'All customer accounts automatically detected',
    'Account balances displayed accurately',
    'Easy switching between accounts',
    'Real-time balance updates'
  ],
  businessValue: 'Consolidated view increases engagement and cross-product usage'
})
export class AllAccountsVisibleExpectation {}

@Expectation({
  name: 'Intuitive Feature Tour',
  description: 'Given first launch, When discovering features, Then intuitive guided tour',
  provider: MobileAppBackendServiceStakeholder,
  consumer: StudentMobileUserStakeholder,
  exchange: {
    inputs: [
      'User profile data (age, account type, preferences)',
      'Tour start/skip/complete action',
      'Current screen context'
    ],
    outputs: [
      'Personalized feature tour content',
      'Tour completion status',
      'Key features highlighted',
      'Tour progress tracking',
      'Option to replay tour later'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'User is authenticated',
      'First app launch or tour requested from settings',
      'User profile data available',
      'App UI is loaded'
    ],
    postconditions: [
      'Tour completed or skipped',
      'Tour completion status saved',
      'User has discovered key features',
      'Tour is accessible from settings for replay'
    ],
    constraints: {
      maxLatency: '< 5 seconds for tour content loading',
      availability: '99.5%',
      security: ['Tour content delivered securely', 'User preferences stored with encryption'],
      custom: {
        contentAge: 'Age-appropriate content for student users',
        skippable: 'Tour should be skippable at any time'
      }
    }
  },
  behaviors: [CompleteFeatureTourBehavior],
  priority: ExpectationPriority.Medium,
  acceptanceCriteria: [
    'Key features highlighted clearly',
    'Tour is skippable',
    'Tour accessible from settings later',
    'Age-appropriate language and examples'
  ],
  businessValue: 'Feature discovery drives usage and satisfaction'
})
export class IntuitiveFeatureTourExpectation {}

@Expectation({
  name: 'Notification Permission',
  description: 'Given onboarding complete, When enabling notifications, Then clear value proposition',
  provider: MobileAppBackendServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Notification permission request',
      'User consent (allow/deny)',
      'Notification preferences (transaction alerts, promotions, security)',
      'Device push notification token'
    ],
    outputs: [
      'Permission status (granted/denied)',
      'Push notification token (if granted)',
      'Notification preferences configuration',
      'Confirmation of settings saved'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Onboarding flow nearly complete',
      'User has seen notification value proposition',
      'OS supports push notifications',
      'Backend notification service available'
    ],
    postconditions: [
      'Notification permission status recorded',
      'Push token stored if permission granted',
      'User preferences saved',
      'Settings accessible from app settings later'
    ],
    constraints: {
      maxLatency: '< 2 seconds for preference save',
      availability: '99.8%',
      security: ['Push token encrypted at rest', 'User can revoke permission anytime'],
      custom: {
        permissionExplanation: 'Must explain benefits before requesting permission',
        granularControls: 'Granular controls for notification types'
      }
    }
  },
  behaviors: [EnableNotificationsBehavior],
  priority: ExpectationPriority.Low,
  acceptanceCriteria: [
    'Explain benefits before requesting permission',
    'Granular notification controls',
    'Can be changed later in settings',
    'Respects OS permission settings'
  ],
  businessValue: 'Opt-in notifications enable proactive customer service'
})
export class NotificationPermissionExpectation {}
