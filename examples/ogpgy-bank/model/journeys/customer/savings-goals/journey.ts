/**
 * Savings Goals Journey
 *
 * AI-powered savings goals with automated recommendations and progress tracking.
 * Enable financial wellness through personalized, achievable savings targets.
 */

import { Journey } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder,
  ActiveSeniorInvestorStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  DigitalAdoptionRate,
  CustomerEffortScore
} from '../../../strategy/metrics.js';
import {
  GoalCreatedMilestone,
  AutoSaveEnabledMilestone,
  GoalInProgressMilestone,
  GoalAchievedMilestone
} from './milestones.js';

// ============================================================================
// JOURNEY (LEVEL 3: User experience flow, aggregates Milestones)
// ============================================================================

@Journey({
  name: 'Savings Goals Journey',
  primaryStakeholder: FamilyPrimaryAccountHolderStakeholder,
  slug: 'savings-goals',
  milestones: [
    { milestone: GoalCreatedMilestone, order: 1 },
    { milestone: AutoSaveEnabledMilestone, order: 2 },
    { milestone: GoalInProgressMilestone, order: 3 },
    { milestone: GoalAchievedMilestone, order: 4 }
  ],
  participatingStakeholders: [
    FamilyPrimaryAccountHolderStakeholder,
    ActiveSeniorInvestorStakeholder
  ],
  metrics: [
    DigitalAdoptionRate,     // 38% → 60%
    CustomerEffortScore      // 3.2 → 1.8
  ],
  outcomes: [
    'Savings goal established with AI guidance',
    'Automated savings in place',
    'Progress visible and motivating',
    'Goal achieved with celebration',
    'Customer financial health improved'
  ],
  triggeringEvent: 'User clicks "Create Savings Goal"',
  extensions: {
    achievement: '✅ AI-powered savings assistant launched Q4 2024',
    targetPersonas: 'Maria (education savings), Dr. Alicia (retirement planning)',
    aiFeatures: 'Personalized recommendations, spending analysis, automated nudges'
  }
})
export class SavingsGoalsJourney {}
