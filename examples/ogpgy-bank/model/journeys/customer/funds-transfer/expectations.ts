/**
 * Funds Transfer Journey - Expectations
 *
 * All stakeholder expectations for funds transfer.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
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
  PaymentProcessingEngineStakeholder
} from '../../../stakeholders/operations/system-stakeholders.js';
import {
  FraudDetectionMonitorStakeholder,
  CoreBankingAccountManagerStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';
import {
  ValidateRecipientBehavior,
  ValidateTransferAmountBehavior,
  AuthenticateUserBehavior,
  PerformFraudDetectionBehavior,
  ExecuteTransferBehavior,
  SendConfirmationBehavior
} from './behaviors.js';

// ============================================================================
// EXPECTATIONS (LEVEL 6: What stakeholders expect, implemented by Behaviors)
// ============================================================================

@Expectation({
  name: 'Real Time Transfer',
  description: 'Given valid transfer, When submitting, Then complete within 5 seconds',
  provider: PaymentProcessingEngineStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Sender account ID',
      'Recipient account ID or details',
      'Transfer amount',
      'Authentication token',
      'Transfer purpose/description'
    ],
    outputs: [
      'Transaction ID',
      'Transfer status (success/pending/failed)',
      'Updated account balances',
      'Transaction timestamp',
      'Confirmation receipt'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Sender is authenticated',
      'Sufficient balance in sender account',
      'Recipient account is valid',
      'Transfer amount within limits',
      'Fraud check passed'
    ],
    postconditions: [
      'Funds debited from sender account',
      'Funds credited to recipient account',
      'Transaction logged in audit trail',
      'Both parties notified',
      'Balances updated in real-time'
    ],
    constraints: {
      maxLatency: '< 5 seconds for transfer processing',
      availability: '99.95%',
      security: ['End-to-end encryption', 'Transaction signing', 'Fraud detection screening'],
      throughput: '1000 concurrent transfers'
    }
  },
  behaviors: [
    ValidateRecipientBehavior,
    ValidateTransferAmountBehavior,
    AuthenticateUserBehavior,
    ExecuteTransferBehavior,
    SendConfirmationBehavior
  ],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Transfer processed in ≤ 5 seconds',
    'Real-time balance update',
    'Instant confirmation',
    'Transaction ID provided'
  ],
  businessValue: 'Real-time payments competitive with neobanks'
})
export class RealTimeTransferExpectation {}

@Expectation({
  name: 'Fraud Detection Accuracy',
  description: 'Given transfer request, When fraud check runs, Then high accuracy detection',
  provider: FraudDetectionMonitorStakeholder,
  consumer: ChiefComplianceOfficerStakeholder,
  exchange: {
    inputs: [
      'Transfer details (amount, recipient, pattern)',
      'Sender transaction history',
      'Device fingerprint',
      'Geolocation data',
      'User behavior patterns'
    ],
    outputs: [
      'Fraud risk score (0-100)',
      'Risk level (low/medium/high)',
      'Fraud indicators detected',
      'Recommended action (approve/review/block)',
      'Fraud detection reasoning'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Transfer request submitted',
      'User history available',
      'Fraud detection models trained',
      'Device data captured'
    ],
    postconditions: [
      'Fraud score calculated',
      'Risk assessment completed',
      'High-risk transfers flagged',
      'Audit log entry created'
    ],
    constraints: {
      maxLatency: '< 500ms for fraud scoring',
      availability: '99.99%',
      security: ['ML models updated regularly', 'Detection rules validated'],
      custom: {
        fraudDetectionRate: 'Fraud detection rate ≥ 95%',
        falsePositiveRate: 'False positive rate < 5%'
      }
    }
  },
  behaviors: [PerformFraudDetectionBehavior],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Fraud detection rate ≥ 95%',
    'False positive rate < 5%',
    'Real-time fraud scoring',
    'Suspicious transfers flagged for review'
  ],
  businessValue: 'Protect customers and bank from fraud while enabling legitimate transfers'
})
export class FraudDetectionAccuracyExpectation {}

@Expectation({
  name: 'Transparent Pricing',
  description: 'Given transfer details, When reviewing, Then transparent fee and exchange rate display',
  provider: PaymentProcessingEngineStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  exchange: {
    inputs: [
      'Transfer amount',
      'Source currency',
      'Destination currency',
      'Transfer type (domestic/international)'
    ],
    outputs: [
      'Transfer fee breakdown',
      'Exchange rate (if applicable)',
      'Total amount to be debited',
      'Amount recipient will receive',
      'Fee justification'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Transfer details provided',
      'Currency rates available',
      'Fee schedule accessible'
    ],
    postconditions: [
      'All fees displayed transparently',
      'Exchange rate shown clearly',
      'Total cost calculated',
      'Customer can accept or cancel'
    ],
    constraints: {
      maxLatency: '< 1 second for fee calculation',
      availability: '99.9%',
      security: ['Fee calculation auditable'],
      custom: {
        hiddenCharges: 'Zero hidden charges',
        feeDisplay: 'Fees must be itemized'
      }
    }
  },
  behaviors: [ValidateTransferAmountBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'All fees shown upfront',
    'Exchange rate displayed clearly',
    'Total cost calculated',
    'No hidden charges'
  ],
  businessValue: 'Transparency builds trust with remittance customers'
})
export class TransparentPricingExpectation {}

@Expectation({
  name: 'Instant Confirmation',
  description: 'Given transfer complete, When confirming, Then both parties notified immediately',
  provider: PaymentProcessingEngineStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Completed transaction ID',
      'Sender contact preferences',
      'Recipient contact preferences'
    ],
    outputs: [
      'Sender confirmation (push notification, email, SMS)',
      'Recipient notification of incoming funds',
      'Transaction receipt',
      'Updated transaction history'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Transfer successfully processed',
      'Notification service available',
      'User contact details on file'
    ],
    postconditions: [
      'Both parties notified',
      'Confirmations delivered',
      'Transaction visible in history',
      'Receipt available for download'
    ],
    constraints: {
      maxLatency: '< 2 seconds for notification delivery',
      availability: '99.9%',
      security: ['Notifications contain minimal PII', 'Receipt accessible via secure link']
    }
  },
  behaviors: [SendConfirmationBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Sender receives instant confirmation',
    'Recipient notified of incoming funds',
    'Push notification and email sent',
    'Transaction visible in history immediately'
  ],
  businessValue: 'Immediate confirmation provides peace of mind and transaction visibility'
})
export class InstantConfirmationExpectation {}

@Expectation({
  name: 'Biometric Authentication',
  description: 'Given mobile transfer, When authenticating, Then biometric authentication available',
  provider: CoreBankingAccountManagerStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Biometric data (fingerprint/face scan)',
      'Device ID',
      'User session context'
    ],
    outputs: [
      'Authentication result (success/failure)',
      'Session token',
      'Fallback options (if biometric fails)'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Biometric authentication enabled on device',
      'User has enrolled biometrics',
      'Transfer requires authentication'
    ],
    postconditions: [
      'User authenticated',
      'Secure session established',
      'Authentication logged',
      'Transfer can proceed'
    ],
    constraints: {
      maxLatency: '< 2 seconds for authentication',
      availability: '99.95%',
      security: ['Biometric data never leaves device', 'Fallback to password available', 'Failed attempts tracked']
    }
  },
  behaviors: [AuthenticateUserBehavior],
  priority: ExpectationPriority.Medium,
  acceptanceCriteria: [
    'Biometric auth supported (fingerprint/face)',
    'Fallback to password available',
    'Authentication completes in < 2 seconds',
    'Secure authentication logged'
  ],
  businessValue: 'Convenient yet secure authentication increases mobile usage'
})
export class BiometricAuthExpectation {}
