/**
 * Savings Goals Journey - Milestones
 *
 * All business-significant milestones in the savings goals journey.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  CreateGoalStep,
  AIRecommendStep,
  SetupAutoSaveStep,
  TrackProgressStep,
  ReceiveNudgesStep,
  AchieveGoalStep
} from './steps.js';
import {
  AIPersonalizedGoalsExpectation,
  EffortlessAutoSaveExpectation,
  ClearProgressTrackingExpectation,
  GoalAchievementCelebrationExpectation,
  SophisticatedAIInsightsExpectation
} from './expectations.js';

// ============================================================================
// MILESTONES (LEVEL 4: Business-significant achievements, aggregate Steps)
// ============================================================================

@Milestone({
  name: 'Goal Created',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: CreateGoalStep, order: 1 },
    { step: AIRecommendStep, order: 2 }
  ],
  expectations: [AIPersonalizedGoalsExpectation, SophisticatedAIInsightsExpectation],
  businessEvent: 'savings.goal.created',
  stateful: true,
  reusable: true
})
export class GoalCreatedMilestone {}

@Milestone({
  name: 'Auto-Save Enabled',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: SetupAutoSaveStep, order: 1 }
  ],
  expectations: [EffortlessAutoSaveExpectation],
  businessEvent: 'savings.autosave.enabled',
  stateful: true,
  reusable: true
})
export class AutoSaveEnabledMilestone {}

@Milestone({
  name: 'Goal In Progress',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: TrackProgressStep, order: 1 },
    { step: ReceiveNudgesStep, order: 2 }
  ],
  expectations: [ClearProgressTrackingExpectation],
  businessEvent: 'savings.goal.in_progress',
  stateful: true,
  reusable: true
})
export class GoalInProgressMilestone {}

@Milestone({
  name: 'Goal Achieved',
  stakeholder: FamilyPrimaryAccountHolderStakeholder,
  steps: [
    { step: AchieveGoalStep, order: 1 }
  ],
  expectations: [GoalAchievementCelebrationExpectation],
  businessEvent: 'savings.goal.achieved',
  stateful: true,
  reusable: false
})
export class GoalAchievedMilestone {}
