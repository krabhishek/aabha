/**
 * Relationship Manager Onboarding Journey - Expectations
 *
 * Stakeholder expectations for RM onboarding and digital transformation.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  HeadRetailBanking,
  ChiefOperatingOfficer,
  BranchManager
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  LearningManagementSystemStakeholder
} from '../../../stakeholders/operations/system-stakeholders.js';

// ============================================================================
// RM Onboarding Expectations
// ============================================================================

@Expectation({
  name: 'Rapid Digital Tools Proficiency',
  description: 'RM achieves 85%+ proficiency in digital tools within 5 days',
  provider: LearningManagementSystemStakeholder,
  consumer: HeadRetailBanking,
  exchange: {
    inputs: [
      'RM profile',
      'Training modules',
      'Digital tools access',
      'Practice scenarios'
    ],
    outputs: [
      'Training completion status',
      'Proficiency score',
      'Skill gaps identified',
      'Readiness assessment'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'RM is hired',
      'Training materials are ready',
      'Digital tools are configured'
    ],
    postconditions: [
      'RM is trained on digital tools',
      'Proficiency is verified',
      'Gaps are addressed',
      'RM is ready for customers'
    ],
    constraints: {
      maxLatency: '< 5 days for initial training',
      availability: '99.5%',
      security: ['Training data encrypted', 'Access controlled'],
      custom: {
        trainingDuration: 'Complete training in 5 days',
        proficiencyThreshold: 'Minimum 85% proficiency score',
        completionRate: '100% of modules completed'
      }
    }
  },
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'RM completes training in 5 days',
    'Achieves 85%+ proficiency score',
    'Can use all digital tools',
    'Ready for customer interactions'
  ],
  businessValue: 'Transform RMs from transactional processors to trusted advisors'
})
export class RapidDigitalToolsProficiencyExpectation {}

@Expectation({
  name: 'Customer Advisory Readiness',
  description: 'RM certified and ready for customer advisory role within 2 weeks',
  provider: BranchManager,
  consumer: ChiefOperatingOfficer,
  exchange: {
    inputs: [
      'Training completion',
      'Product knowledge',
      'Shadowing experience',
      'Practice sessions'
    ],
    outputs: [
      'Advisory readiness score',
      'Certification status',
      'Customer assignment',
      'Ongoing support plan'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Training is complete',
      'RM has shadowed experienced RMs',
      'Practice sessions completed'
    ],
    postconditions: [
      'RM is certified',
      'Customers are assigned',
      'Support is available',
      'Performance is tracked'
    ],
    constraints: {
      maxLatency: '< 2 weeks for full onboarding',
      availability: '24/7 support',
      security: ['Customer data protected', 'Access properly configured'],
      custom: {
        onboardingDuration: 'Complete onboarding in 2 weeks',
        certificationRate: '100% certification before customer assignment'
      }
    }
  },
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'RM certified within 2 weeks',
    'Ready for customer advisory role',
    'Confident with digital tools',
    'Ongoing support available'
  ],
  businessValue: 'Enable branch transformation - from transaction centers to advisory centers'
})
export class CustomerAdvisoryReadinessExpectation {}
