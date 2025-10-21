/**
 * Branch Digitization Initiative
 *
 * Transform 247 branches from transactional centers to advisory centers
 * by empowering staff with digital tools and data.
 *
 * Owner: Priya Sharma, Chief Operating Officer
 */

import { BusinessInitiative } from '../../../../src/index.js';
import { DigitalTransformationStrategy } from '../strategy/digital-transformation-strategy.js';
import {
  DigitalAdoptionRate,
  CustomerEffortScore,
  OperationalCostReduction
} from '../strategy/metrics.js';
// Journey imports
import { RelationshipManagerOnboardingJourney } from '../journeys/internal/relationship-manager-onboarding/index.js';

@BusinessInitiative({
  name: 'Branch Digitization',
  strategy: DigitalTransformationStrategy,
  journeys: [RelationshipManagerOnboardingJourney],
  metrics: [
    DigitalAdoptionRate,
    CustomerEffortScore,
    OperationalCostReduction
  ],
  objectives: [
    'Equip all 247 branches with digital-first tools by end of Phase 4',
    'Train 8,200 employees in digital banking skills',
    'Shift 60% of transactional work to digital channels',
    'Enable relationship managers with real-time customer insights',
    'Reduce branch operational costs by 15% while improving service quality'
  ],
  timeline: {
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    milestones: [
      {
        name: 'Phase 1: Pilot Branches (10 branches)',
        targetDate: '2024-06-30',
        description: 'Pilot smart branch concept in 10 locations'
      },
      {
        name: 'Phase 2: Major Cities (100 branches) - IN PROGRESS',
        targetDate: '2025-06-30',
        description: 'Roll out to 100 branches in major cities'
      },
      {
        name: 'Phase 3: Regional Expansion (137 branches)',
        targetDate: '2026-06-30',
        description: 'Expand to regional and rural branches'
      },
      {
        name: 'Phase 4: Full Rollout Complete',
        targetDate: '2026-12-31',
        description: 'All 247 branches digitized'
      }
    ]
  },
  owner: 'Priya Sharma, Chief Operating Officer',
  team: [
    'Branch Operations',
    'HR & Training (Catherine Brown)',
    'Technology & Digital',
    'Customer Experience',
    'Facilities (Daniel Wu)'
  ],
  budget: {
    amount: 15000000,
    currency: 'GD$',
    breakdown: {
      'Hardware & Infrastructure': 6000000,
      'Training & Change Management': 4000000,
      'Software & Tools': 3000000,
      'Facilities Redesign': 2000000
    }
  },
  extensions: {
    backstory: 'Led by Priya Sharma (45), 20 years at OgPgyBank, started as branch manager. Philosophy: "Operations excellence is customer love made systematic"',
    current_status: '🔄 Branch digitization (Phase 2 of 4) as of Q4 2024',
    transformation_vision: 'From transactional centers to advisory centers - "Branches aren\'t dying, they\'re evolving"',
    key_capabilities: [
      'Relationship Manager Digital Cockpit - real-time customer 360° view',
      'Assisted digital service - staff help customers use mobile app',
      'Smart queuing and appointment systems',
      'Paperless processes - all forms digital',
      'Video advisory for specialized services',
      'Real-time translation for migrant workers'
    ],
    employee_impact: 'Reskilling 8,200 employees from tellers to financial advisors',
    challenge: 'Balance digital transformation with OgPgyBank\'s community-first heritage',
    target_personas: 'Margaret O\'Connor (senior, needs assisted digital), Relationship Managers supporting high-value customers'
  }
})
export class BranchDigitizationInitiative {}
