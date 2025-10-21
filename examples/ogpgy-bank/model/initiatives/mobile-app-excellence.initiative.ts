/**
 * Mobile App Excellence Initiative
 *
 * Drive mobile as the primary banking channel with world-class app experience.
 * Target: 4.8+ star rating, grow from 1.2M to 2.0M active users.
 *
 * Owner: Lisa Wong, Chief Digital Officer
 */

import { BusinessInitiative } from '../../../../src/index.js';
import { DigitalTransformationStrategy } from '../strategy/digital-transformation-strategy.js';
import {
  MobileAppRating,
  MobileActiveUsers,
  DigitalAdoptionRate,
  CustomerEffortScore
} from '../strategy/metrics.js';
// Journey imports
import { MobileOnboardingJourney } from '../journeys/customer/mobile-onboarding/index.js';
import { AccountOpeningJourney } from '../journeys/customer/account-opening/index.js';
import { FundsTransferJourney } from '../journeys/customer/funds-transfer/index.js';

@BusinessInitiative({
  name: 'Mobile App Excellence',
  strategy: DigitalTransformationStrategy,
  journeys: [
    MobileOnboardingJourney,
    AccountOpeningJourney,
    FundsTransferJourney
  ],
  metrics: [
    MobileAppRating,
    MobileActiveUsers,
    DigitalAdoptionRate,
    CustomerEffortScore
  ],
  objectives: [
    'Maintain 4.8+ star app rating as user base grows',
    'Grow mobile active users from 1.2M to 2.0M',
    'Make mobile primary channel for 60% of transactions',
    'Reduce customer effort score to 1.8 through seamless mobile UX',
    'Enable 100% of retail banking services on mobile'
  ],
  timeline: {
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    milestones: [
      {
        name: 'Mobile App V2 Launch',
        targetDate: '2024-06-15',
        description: 'Launched with 4.8 star rating, 500K downloads'
      },
      {
        name: 'Reach 1.5M Mobile Active Users',
        targetDate: '2025-03-31',
        description: 'Midpoint to 2M target'
      },
      {
        name: 'Full Feature Parity',
        targetDate: '2025-06-30',
        description: '100% of retail banking services available on mobile'
      },
      {
        name: 'Reach 2M Mobile Active Users',
        targetDate: '2025-12-31',
        description: 'Final target achieved'
      }
    ]
  },
  owner: 'Lisa Wong, Chief Digital Officer',
  team: ['Mobile Engineering', 'Product Design', 'QA', 'Customer Experience', 'Marketing'],
  budget: {
    amount: 3500000,
    currency: 'GD$',
    breakdown: {
      Engineering: 2000000,
      Design: 500000,
      Marketing: 500000,
      Infrastructure: 500000
    }
  },
  extensions: {
    backstory: 'Led by Lisa Wong (37), ex-neobank product lead. Philosophy: "Digital isn\'t a channel, it\'s a mindset"',
    current_status: '✅ New mobile app launched (4.8 stars, 500K downloads) as of Q4 2024',
    key_features: [
      'Instant account opening in 5 minutes',
      'AI-powered savings assistant',
      'Biometric authentication',
      'Real-time notifications',
      'Bill payment and funds transfer',
      'Mobile check deposit',
      'Budget tracking and financial insights'
    ],
    target_personas: 'Marcus Lee (young professional), Zara Ahmed (student), Maria Santos (working mother), Dr. Alicia Fernandez (mass affluent)'
  }
})
export class MobileAppExcellenceInitiative {}
