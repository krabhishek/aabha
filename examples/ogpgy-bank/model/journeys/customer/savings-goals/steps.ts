/**
 * Savings Goals Journey - Steps
 *
 * All granular steps in the savings goals journey.
 * Steps are independent entities referenced by Milestones.
 */

import { Step } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';

// ============================================================================
// STEPS (LEVEL 5: Granular actions, referenced by Milestones)
// ============================================================================

@Step({
  name: 'Create Savings Goal',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 1
})
export class CreateGoalStep {}

@Step({
  name: 'AI Recommends Savings Amount',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 2
})
export class AIRecommendStep {}

@Step({
  name: 'Set Up Auto-Save Rules',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 3
})
export class SetupAutoSaveStep {}

@Step({
  name: 'Track Progress',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 4
})
export class TrackProgressStep {}

@Step({
  name: 'Receive Encouragement Nudges',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 5
})
export class ReceiveNudgesStep {}

@Step({
  name: 'Achieve Goal',
  actor: FamilyPrimaryAccountHolderStakeholder,
  order: 6
})
export class AchieveGoalStep {}
