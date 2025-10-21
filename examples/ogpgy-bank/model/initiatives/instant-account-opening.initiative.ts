/**
 * Instant Account Opening Initiative
 *
 * Transform account opening from 5 days to 5 minutes through digital KYC
 * and AI-powered verification.
 *
 * Owner: Michael Santos, Chief Customer Officer
 */

import { BusinessInitiative } from '../../../../src/index.js';
import { DigitalTransformationStrategy } from '../strategy/digital-transformation-strategy.js';
import {
  AccountOpeningTime,
  CustomerEffortScore,
  NetPromoterScore
} from '../strategy/metrics.js';
// Journey imports
import { AccountOpeningJourney } from '../journeys/customer/account-opening/index.js';

@BusinessInitiative({
  name: 'Instant Account Opening',
  strategy: DigitalTransformationStrategy,
  journeys: [AccountOpeningJourney],
  metrics: [
    AccountOpeningTime,
    CustomerEffortScore,
    NetPromoterScore
  ],
  objectives: [
    'Reduce account opening time from 5 days to 5 minutes (99.93% reduction)',
    'Achieve 85%+ conversion rate for started applications',
    'Enable fully digital KYC with 99.5% accuracy',
    'Support instant account opening on mobile, web, and assisted branch',
    'First deposit within 10 minutes of account creation'
  ],
  timeline: {
    startDate: '2023-06-01',
    endDate: '2024-09-30',
    milestones: [
      {
        name: 'AI Document Verification Deployed',
        targetDate: '2023-10-15',
        description: 'AI can verify ID documents with 99.5% accuracy'
      },
      {
        name: 'Digital KYC Integration',
        targetDate: '2024-02-28',
        description: 'Real-time integration with Genai Central Bank for verification'
      },
      {
        name: 'Instant Account Opening Live',
        targetDate: '2024-06-15',
        description: '5-minute account opening available to all customers'
      },
      {
        name: 'Full Rollout Complete',
        targetDate: '2024-09-30',
        description: 'All channels (mobile, web, branch) support instant opening'
      }
    ]
  },
  owner: 'Michael Santos, Chief Customer Officer',
  team: [
    'Customer Experience Design',
    'Mobile Engineering',
    'AI/ML Team',
    'Risk & Compliance',
    'Operations',
    'Branch Training'
  ],
  budget: {
    amount: 2800000,
    currency: 'GD$',
    breakdown: {
      'AI/ML Development': 1200000,
      'System Integration': 800000,
      Compliance: 400000,
      Training: 400000
    }
  },
  extensions: {
    backstory: 'Led by Michael Santos (43), 15 years in retail banking. Philosophy: "Every complaint is a gift—it tells us where we\'re failing"',
    current_status: '✅ Instant account opening (down from 5 days to 5 minutes) as of Q4 2024',
    wake_up_call: 'Q2 2022: Lost 120,000 customers to NeoBrightBank which offered instant account opening',
    key_innovations: [
      'AI-powered document verification (99.5% accuracy)',
      'Real-time KYC with Genai Central Bank',
      'Biometric identity verification',
      'Automated compliance screening',
      'Instant card issuance (virtual card immediate, physical card 2 days)'
    ],
    customer_impact: 'From "I\'ll come back next week" to "I\'m banking right now"',
    target_personas: 'Marcus Lee (young professional), Zara Ahmed (student), Kevin Tan (SME owner)'
  }
})
export class InstantAccountOpeningInitiative {}
