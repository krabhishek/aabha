/**
 * Relationship Manager Onboarding Journey - Behaviors
 *
 * Observable behaviors with witness methods for RM onboarding.
 */

import { Behavior, Witness, WitnessType } from '../../../../../../src/index.js';
import {
  HeadRetailBanking,
  ChiefOperatingOfficer,
  BranchManager
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  LearningManagementSystemStakeholder
} from '../../../stakeholders/operations/system-stakeholders.js';

// ============================================================================
// RM Onboarding Behaviors
// ============================================================================

@Behavior({
  name: 'Complete Digital Tools Training',
  participants: [LearningManagementSystemStakeholder, HeadRetailBanking],
  preconditions: ['RM hired', 'Training modules ready'],
  postconditions: ['Training complete', 'Proficiency verified']
})
export class CompleteDigitalToolsTrainingBehavior {
  @Witness({
    name: 'RM completes training in 5 days',
    type: WitnessType.Integration,
    given: ['New RM hired', 'Training materials available', 'Digital tools configured'],
    when: ['RM completes all modules', 'Proficiency test passed'],
    then: ['Training marked complete', 'Proficiency score recorded', 'RM ready for next phase']
  })
  trainingCompletedIn5Days() {
    // Proof: Integration test verifying training completion
  }

  @Witness({
    name: 'RM achieves 85%+ proficiency',
    type: WitnessType.Integration,
    given: ['Training modules completed', 'Practice sessions done'],
    when: ['Proficiency test taken'],
    then: ['Score ≥ 85%', 'Certification granted', 'Ready for customer interactions']
  })
  proficiencyAchieved() {
    // Proof: Integration test verifying proficiency threshold
  }
}

@Behavior({
  name: 'Prepare for Customer Advisory',
  participants: [BranchManager, HeadRetailBanking],
  preconditions: ['Training complete', 'Digital tools proficient'],
  postconditions: ['Advisory ready', 'Customers assigned']
})
export class PrepareForCustomerAdvisoryBehavior {
  @Witness({
    name: 'RM shadows experienced colleague',
    type: WitnessType.E2E,
    given: ['RM training complete', 'Experienced RM available'],
    when: ['RM shadows real customer meetings', 'Observes advisory techniques'],
    then: ['Shadowing complete', 'Confidence increased', 'Ready for own customers']
  })
  shadowingExperienced() {
    // Proof: E2E test verifying shadowing experience
  }

  @Witness({
    name: 'First customer meeting successful',
    type: WitnessType.E2E,
    given: ['RM fully trained', 'Customer assigned', 'Support available'],
    when: ['RM conducts first meeting', 'Uses digital tools effectively'],
    then: ['Meeting successful', 'Customer satisfied', 'RM confidence confirmed']
  })
  firstMeetingSuccessful() {
    // Proof: E2E test verifying first customer interaction
  }
}

@Behavior({
  name: 'Certify RM for Branch Work',
  participants: [ChiefOperatingOfficer, BranchManager],
  preconditions: ['All training complete', 'First meeting successful'],
  postconditions: ['RM certified', 'Performance tracking active']
})
export class CertifyRMForBranchWorkBehavior {
  @Witness({
    name: 'RM certified within 2 weeks',
    type: WitnessType.Integration,
    given: ['Training complete', 'Shadowing done', 'First meeting successful'],
    when: ['Onboarding reviewed', 'Certification criteria met'],
    then: ['RM certified', 'Full customer portfolio assigned', 'Performance tracking begins']
  })
  certifiedWithin2Weeks() {
    // Proof: Integration test verifying 2-week onboarding timeline
  }
}
