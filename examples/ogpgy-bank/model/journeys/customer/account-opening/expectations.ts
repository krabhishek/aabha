/**
 * Account Opening Journey - Expectations
 *
 * All stakeholder expectations for account opening.
 * Expectations define WHAT stakeholders expect, implemented by Behaviors.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder,
  StudentMobileUserStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  LoyalSeniorCustomerStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  DocumentVerificationAIProviderStakeholder,
  VirtualCardIssuerStakeholder,
  MobileAppBackendServiceStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';
import {
  ChiefComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  ValidateEmailBehavior,
  UploadVerifyDocumentBehavior,
  PerformKYCCheckBehavior,
  CreateAccountBehavior,
  IssueVirtualCardBehavior
} from './behaviors.js';

// ============================================================================
// EXPECTATIONS (LEVEL 6: What stakeholders expect, implemented by Behaviors)
// ============================================================================

@Expectation({
  name: 'Five Minute Account Opening',
  description: 'Given new customer, When opening account, Then complete within 5 minutes',
  provider: MobileAppBackendServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Customer email address',
      'Government-issued ID document image',
      'Selfie photo for biometric verification',
      'Personal information (name, date of birth, address)'
    ],
    outputs: [
      'Account number',
      'Account activation status',
      'Virtual debit card details',
      'Welcome message with next steps'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Customer has valid government-issued ID',
      'Mobile app is installed',
      'Camera access granted',
      'Central Bank KYC service available'
    ],
    postconditions: [
      'Account created in core banking system',
      'KYC verification completed and logged',
      'Virtual card issued and provisioned',
      'Customer notified of successful activation',
      'Audit trail created'
    ],
    constraints: {
      maxLatency: '< 5 minutes (target: 3 minutes)',
      availability: '99.9% (excluding planned maintenance)',
      security: ['TLS 1.3 for data transmission', 'Document images encrypted at rest'],
      throughput: '100 concurrent account openings'
    }
  },
  behaviors: [ValidateEmailBehavior, UploadVerifyDocumentBehavior, PerformKYCCheckBehavior, CreateAccountBehavior],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Total time from start to account activation ≤ 5 minutes',
    'No manual intervention required for standard cases',
    '99.5% AI verification accuracy',
    'Clear progress indication at each step'
  ],
  businessValue: 'Competitive advantage - fastest account opening in Genai, prevents customer loss to neobanks'
})
export class FiveMinuteAccountOpeningExpectation {}

@Expectation({
  name: 'AI Verification Accuracy',
  description: 'Given uploaded ID, When AI verifies, Then 99.5% accuracy achieved',
  provider: DocumentVerificationAIProviderStakeholder,
  consumer: ChiefComplianceOfficerStakeholder,
  exchange: {
    inputs: [
      'ID document image (JPEG/PNG)',
      'Selfie photo for biometric comparison',
      'Expected document type (passport, national ID, driver license)'
    ],
    outputs: [
      'Verification confidence score (0-100%)',
      'Extracted identity data (name, DOB, ID number)',
      'Biometric match result (pass/fail)',
      'Document authenticity score',
      'Recommended action (approve/review/reject)'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Document image quality sufficient (min 300 DPI)',
      'Face visible in selfie',
      'Document is government-issued ID'
    ],
    postconditions: [
      'Verification result stored',
      'Confidence score calculated',
      'Audit log entry created',
      'Manual review triggered if confidence < 95%'
    ],
    constraints: {
      maxLatency: '< 30 seconds',
      availability: '99.95%',
      security: ['SOC 2 Type II certified', 'PII encrypted in transit and at rest'],
      custom: {
        accuracy: '≥ 99.5% on standard government IDs',
        falsePositiveRate: '< 0.5%'
      }
    }
  },
  behaviors: [UploadVerifyDocumentBehavior, PerformKYCCheckBehavior],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'AI verification accuracy ≥ 99.5%',
    'False positive rate < 0.5%',
    'Escalation to manual review when confidence < 95%',
    'Audit trail for all verifications'
  ],
  businessValue: 'Regulatory compliance + customer trust through accurate identity verification'
})
export class AIVerificationAccuracyExpectation {}

@Expectation({
  name: 'Instant Virtual Card',
  description: 'Given account creation, When activating, Then virtual card issued immediately',
  provider: VirtualCardIssuerStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Account number',
      'Customer identity (name, address)',
      'Card type (debit)',
      'Initial spending limits'
    ],
    outputs: [
      'Virtual card number (16 digits)',
      'CVV code',
      'Expiry date',
      'Card provisioning token for Apple Pay / Google Pay',
      'Physical card order confirmation'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Account is active',
      'KYC verification completed',
      'Customer profile created',
      'Card issuer platform available'
    ],
    postconditions: [
      'Virtual card provisioned to mobile wallet',
      'Card details encrypted and stored',
      'Card enabled for online transactions',
      'Physical card ordered for delivery',
      'Customer notified in app'
    ],
    constraints: {
      maxLatency: '< 5 seconds',
      availability: '99.99%',
      security: ['PCI DSS Level 1 compliant', 'Card details tokenized', 'HSM for key storage'],
      custom: {
        cardNetwork: 'Visa Debit',
        physicalDelivery: '2-3 business days'
      }
    }
  },
  behaviors: [IssueVirtualCardBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Virtual card issued within seconds of account creation',
    'Card details encrypted and secure',
    'Card immediately usable for online transactions',
    'Physical card ordered automatically (2-day delivery)'
  ],
  businessValue: 'Immediate banking utility - customer can transact immediately, not wait for physical card'
})
export class InstantVirtualCardExpectation {}

@Expectation({
  name: 'Seamless Mobile UX',
  description: 'Given mobile app, When opening account, Then seamless UX on all devices',
  provider: MobileAppBackendServiceStakeholder,
  consumer: StudentMobileUserStakeholder,
  exchange: {
    inputs: [
      'User interaction events (taps, swipes)',
      'Device information (OS, screen size)',
      'Camera input for document capture',
      'Network connectivity status'
    ],
    outputs: [
      'Responsive UI components',
      'Step-by-step guidance',
      'Progress indicators',
      'Error messages with recovery options',
      'Auto-saved application state'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Mobile app installed (iOS 14+ or Android 10+)',
      'Camera permission granted',
      'Network connection available',
      'Sufficient storage for document images'
    ],
    postconditions: [
      'Application state persisted',
      'Progress saved for session recovery',
      'User can resume from any step',
      'Clear feedback provided at each step'
    ],
    constraints: {
      maxLatency: '< 500ms for UI interactions',
      availability: '99.9%',
      custom: {
        supportedDevices: 'iOS 14+, Android 10+',
        screenSizes: '4.7" to 6.7" displays',
        offlineCapability: 'Draft save with sync on reconnect'
      }
    }
  },
  behaviors: [ValidateEmailBehavior, UploadVerifyDocumentBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Works on iOS and Android',
    'Responsive design for all screen sizes',
    'Clear instructions at each step',
    'Easy document capture with camera guidance',
    'Progress saved if app backgrounded'
  ],
  businessValue: 'Mobile-first customers like Zara demand flawless mobile experience'
})
export class SeamlessMobileUXExpectation {}

@Expectation({
  name: 'Assisted Digital Option',
  description: 'Given senior customer, When opening account, Then assisted digital option available',
  provider: MobileAppBackendServiceStakeholder,
  consumer: LoyalSeniorCustomerStakeholder,
  exchange: {
    inputs: [
      'Customer request for assistance',
      'Preferred assistance channel (branch, phone, video)',
      'Current application progress',
      'Difficulty areas reported'
    ],
    outputs: [
      'Assisted digital session',
      'Staff guidance (in-person or remote)',
      'Video tutorial links',
      'Simplified step-by-step instructions',
      'Alternative completion methods'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Customer has requested assistance',
      'Assistance channel is available',
      'Staff trained on assisted digital process',
      'Customer profile indicates senior or low digital literacy'
    ],
    postconditions: [
      'Customer successfully completes step with assistance',
      'Progress recorded for future sessions',
      'Feedback captured on assistance quality',
      'Alternative methods offered if needed'
    ],
    constraints: {
      maxLatency: '< 2 minutes to connect with assistance',
      availability: 'Branch hours + 24/7 phone support',
      custom: {
        assistanceChannels: 'Branch walk-in, Phone, Video call',
        staffTraining: 'All branch staff certified in assisted digital',
        seniorFriendly: 'Large fonts, clear instructions, patient service'
      }
    }
  },
  behaviors: [ValidateEmailBehavior, UploadVerifyDocumentBehavior, CreateAccountBehavior],
  priority: ExpectationPriority.Medium,
  acceptanceCriteria: [
    'Branch staff can guide customer through mobile app',
    'Phone support available for assistance',
    'Video tutorial accessible at each step',
    'Fallback to staff-assisted process if needed'
  ],
  businessValue: 'Inclusive banking - don\'t leave seniors like Margaret behind in digital transformation'
})
export class AssistedDigitalOptionExpectation {}
