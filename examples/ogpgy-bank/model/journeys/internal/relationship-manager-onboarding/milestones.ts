/**
 * Relationship Manager Onboarding Journey - Milestones
 *
 * Business-significant milestones in RM onboarding process.
 */

import { Milestone } from '../../../../../../src/index.js';
import {
  HeadRetailBanking,
  ChiefOperatingOfficer,
  BranchManager
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  WelcomeOrientationStep,
  DigitalToolsTrainingStep,
  ProductKnowledgeTrainingStep,
  ComplianceTrainingStep,
  CustomerAdvisoryPracticeStep,
  ShadowExperiencedRMStep,
  FirstCustomerMeetingStep,
  OnboardingCompleteStep
} from './steps.js';

// ============================================================================
// RM Onboarding Milestones
// ============================================================================

@Milestone({
  name: 'Training Complete',
  stakeholder: HeadRetailBanking,
  steps: [
    { step: WelcomeOrientationStep, order: 1 },
    { step: DigitalToolsTrainingStep, order: 2 },
    { step: ProductKnowledgeTrainingStep, order: 3 },
    { step: ComplianceTrainingStep, order: 4 }
  ],
  businessEvent: 'rm.training.complete',
  stateful: true,
  reusable: true
})
export class TrainingCompleteMilestone {}

@Milestone({
  name: 'Ready for Customers',
  stakeholder: BranchManager,
  steps: [
    { step: CustomerAdvisoryPracticeStep, order: 1 },
    { step: ShadowExperiencedRMStep, order: 2 }
  ],
  businessEvent: 'rm.ready.for.customers',
  stateful: true,
  reusable: true
})
export class ReadyForCustomersMilestone {}

@Milestone({
  name: 'Fully Onboarded',
  stakeholder: ChiefOperatingOfficer,
  steps: [
    { step: FirstCustomerMeetingStep, order: 1 },
    { step: OnboardingCompleteStep, order: 2 }
  ],
  businessEvent: 'rm.onboarding.complete',
  stateful: true,
  reusable: true
})
export class FullyOnboardedMilestone {}
