/**
 * Relationship Manager Onboarding Journey
 *
 * Onboarding new relationship managers with digital tools and training.
 * Transform RMs from transactional processors to trusted advisors.
 */

import { Journey } from '../../../../../../src/index.js';
import {
  HeadRetailBanking,
  ChiefOperatingOfficer,
  BranchManager
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  DigitalAdoptionRate,
  CustomerEffortScore
} from '../../../strategy/metrics.js';
import {
  TrainingCompleteMilestone,
  ReadyForCustomersMilestone,
  FullyOnboardedMilestone
} from './milestones.js';

@Journey({
  name: 'Relationship Manager Onboarding Journey',
  primaryStakeholder: HeadRetailBanking,
  slug: 'relationship-manager-onboarding',
  milestones: [
    { milestone: TrainingCompleteMilestone, order: 1 },
    { milestone: ReadyForCustomersMilestone, order: 2 },
    { milestone: FullyOnboardedMilestone, order: 3 }
  ],
  participatingStakeholders: [
    HeadRetailBanking,
    ChiefOperatingOfficer,
    BranchManager
  ],
  metrics: [
    DigitalAdoptionRate,
    CustomerEffortScore
  ],
  outcomes: [
    'RM trained on digital tools',
    'RM ready for customer advisory role',
    'Branch transformation enabled',
    'Customer experience improved'
  ],
  triggeringEvent: 'New relationship manager hired',
  extensions: {
    goal: 'Onboard RMs in 2 weeks - from transactional to advisory',
    philosophy: '"Branches aren\'t dying—they\'re evolving into advice centers"',
    transformation: 'From 4-week manual onboarding to 2-week digital-first onboarding',
    metrics_detail: {
      onboardingTime: '2 weeks target (down from 4 weeks)',
      proficiencyScore: '≥ 85% on digital tools',
      digitalAdoption: '60% of transactions digital'
    }
  }
})
export class RelationshipManagerOnboardingJourney {}
