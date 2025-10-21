/**
 * Mobile Onboarding Journey
 *
 * First-time mobile app setup and feature discovery for existing customers.
 * Goal: Get customers productive with mobile app within 10 minutes.
 */

import { Journey } from '../../../../../../src/index.js';
import {
  DigitalFirstCustomerStakeholder,
  StudentMobileUserStakeholder
} from '../../../stakeholders/digital-banking/customer-stakeholders.js';
import {
  MobileActiveUsers,
  DigitalAdoptionRate,
  MobileAppRating
} from '../../../strategy/metrics.js';
import {
  AppAuthenticatedMilestone,
  AccountsLinkedMilestone,
  FeaturesDiscoveredMilestone
} from './milestones.js';

// ============================================================================
// JOURNEY (LEVEL 3: User experience flow, aggregates Milestones)
// ============================================================================

@Journey({
  name: 'Mobile Onboarding Journey',
  primaryStakeholder: DigitalFirstCustomerStakeholder,
  slug: 'mobile-onboarding',
  milestones: [
    { milestone: AppAuthenticatedMilestone, order: 1 },
    { milestone: AccountsLinkedMilestone, order: 2 },
    { milestone: FeaturesDiscoveredMilestone, order: 3 }
  ],
  participatingStakeholders: [
    DigitalFirstCustomerStakeholder,
    StudentMobileUserStakeholder
  ],
  metrics: [
    MobileActiveUsers,      // 1.2M → 2.0M
    DigitalAdoptionRate,    // 38% → 60%
    MobileAppRating         // 4.8★ target
  ],
  outcomes: [
    'Customer has mobile app installed and configured',
    'Biometric authentication enabled for convenience',
    'All accounts visible in app',
    'Customer understands key features',
    'Ready to perform mobile transactions'
  ],
  triggeringEvent: 'Customer downloads OgPgyBank mobile app',
  extensions: {
    achievement: '✅ Mobile app launched with 4.8 stars, 500K downloads',
    targetMetric: 'Mobile Active Users: 1.2M → 2.0M',
    targetPersonas: 'Marcus (young professional), Zara (student) - digital natives'
  }
})
export class MobileOnboardingJourney {}
