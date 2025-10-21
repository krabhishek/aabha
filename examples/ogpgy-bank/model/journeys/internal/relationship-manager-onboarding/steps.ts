/**
 * Relationship Manager Onboarding Journey - Steps
 *
 * Onboarding new relationship managers with digital tools and training.
 */

import { Step } from '../../../../../../src/index.js';
import {
  HeadRetailBanking,
  ChiefOperatingOfficer,
  BranchManager
} from '../../../stakeholders/organizational-stakeholders.js';

// ============================================================================
// RM Onboarding Steps
// ============================================================================

@Step({
  name: 'Welcome and Orientation',
  actor: BranchManager,
  order: 1
})
export class WelcomeOrientationStep {}

@Step({
  name: 'Digital Tools Training',
  actor: HeadRetailBanking,
  order: 2
})
export class DigitalToolsTrainingStep {}

@Step({
  name: 'Product Knowledge Training',
  actor: HeadRetailBanking,
  order: 3
})
export class ProductKnowledgeTrainingStep {}

@Step({
  name: 'Compliance Training',
  actor: BranchManager,
  order: 4
})
export class ComplianceTrainingStep {}

@Step({
  name: 'Customer Advisory Practice',
  actor: HeadRetailBanking,
  order: 5
})
export class CustomerAdvisoryPracticeStep {}

@Step({
  name: 'Shadow Experienced RM',
  actor: BranchManager,
  order: 6
})
export class ShadowExperiencedRMStep {}

@Step({
  name: 'First Customer Meeting',
  actor: BranchManager,
  order: 7
})
export class FirstCustomerMeetingStep {}

@Step({
  name: 'Onboarding Complete',
  actor: ChiefOperatingOfficer,
  order: 8
})
export class OnboardingCompleteStep {}
