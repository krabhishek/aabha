/**
 * Savings Goals Journey - Expectations
 *
 * All stakeholder expectations for savings goals.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  FamilyPrimaryAccountHolderStakeholder,
  ActiveSeniorInvestorStakeholder
} from '../../../stakeholders/retail-banking/customer-stakeholders.js';
import {
  MobileAppBackendServiceStakeholder,
  CoreBankingAccountManagerStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';
import {
  CreateGoalBehavior,
  GenerateAIRecommendationBehavior,
  ConfigureAutoSaveBehavior,
  TrackProgressBehavior,
  CelebrateAchievementBehavior,
  SendAINudgesBehavior
} from './behaviors.js';

// ============================================================================
// EXPECTATIONS (LEVEL 6: What stakeholders expect, implemented by Behaviors)
// ============================================================================

@Expectation({
  name: 'AI Personalized Goals',
  description: 'Given savings goal, When AI recommends, Then personalized and achievable',
  provider: MobileAppBackendServiceStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'User income and spending history',
      'Existing account balances',
      'Financial goals and timeline',
      'Risk tolerance preferences'
    ],
    outputs: [
      'Personalized savings recommendations',
      'Recommended monthly/weekly savings amount',
      'Multiple saving plan options',
      'Explanation of AI recommendation logic',
      'Projected goal completion date'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'User has sufficient transaction history',
      'AI recommendation engine available',
      'User profile data accessible'
    ],
    postconditions: [
      'Recommendations generated and displayed',
      'User can select or customize recommendation',
      'Recommendation rationale explained',
      'Goal ready to be created'
    ],
    constraints: {
      maxLatency: '< 3 seconds for AI recommendation',
      availability: '99.5%',
      security: ['User financial data encrypted', 'AI model outputs anonymized'],
      custom: {
        achievability: 'Recommendations must be achievable based on income',
        options: 'Multiple options provided'
      }
    }
  },
  behaviors: [GenerateAIRecommendationBehavior, CreateGoalBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'AI analyzes income/spending patterns',
    'Realistic recommendations based on analysis',
    'Multiple saving amount options provided',
    'Explanation of how recommendation was calculated'
  ],
  businessValue: 'AI-powered financial wellness increases engagement and deposits'
})
export class AIPersonalizedGoalsExpectation {}

@Expectation({
  name: 'Effortless Auto Save',
  description: 'Given goal created, When auto-save enabled, Then effortless savings',
  provider: CoreBankingAccountManagerStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Savings goal details',
      'Auto-save rule configuration (frequency, amount)',
      'Source account for transfers',
      'Round-up preferences (optional)'
    ],
    outputs: [
      'Auto-save rule confirmation',
      'Scheduled transfer details',
      'Rule activation status',
      'Option to pause or modify'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Goal is created',
      'Source account has sufficient balance',
      'Auto-save rule is configured'
    ],
    postconditions: [
      'Auto-save rule activated',
      'Scheduled transfers configured',
      'User can modify or pause anytime',
      'Automatic transfers begin'
    ],
    constraints: {
      maxLatency: '< 2 seconds for rule setup',
      availability: '99.9%',
      security: ['Transfer rules encrypted', 'User can revoke anytime'],
      custom: {
        scheduling: 'Flexible scheduling options',
        roundUp: 'Round-up feature available'
      }
    }
  },
  behaviors: [ConfigureAutoSaveBehavior],
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Auto-save rules easy to configure',
    'Flexible scheduling (daily, weekly, monthly)',
    'Round-up purchases option available',
    'Can pause or modify rules anytime'
  ],
  businessValue: 'Automated savings drives deposit growth and customer financial health'
})
export class EffortlessAutoSaveExpectation {}

@Expectation({
  name: 'Clear Progress Tracking',
  description: 'Given active goal, When checking progress, Then clear visibility and motivation',
  provider: MobileAppBackendServiceStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Savings goal ID',
      'Current balance request',
      'Progress tracking request'
    ],
    outputs: [
      'Current progress percentage',
      'Amount saved vs. target',
      'Amount remaining',
      'Projected completion date',
      'Progress visualization data'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Active savings goal exists',
      'Goal data is current',
      'User is authenticated'
    ],
    postconditions: [
      'Progress displayed clearly',
      'Visual encouragement provided',
      'Milestone achievements highlighted',
      'User motivated to continue'
    ],
    constraints: {
      maxLatency: '< 1 second for progress retrieval',
      availability: '99.8%',
      security: ['Progress data encrypted'],
      custom: {
        balanceUpdates: 'Real-time balance updates',
        messaging: 'Motivational messaging'
      }
    }
  },
  behaviors: [TrackProgressBehavior, SendAINudgesBehavior],
  priority: ExpectationPriority.Medium,
  acceptanceCriteria: [
    'Progress bar shows percentage complete',
    'Amount saved and remaining clearly shown',
    'Projected completion date displayed',
    'Visual progress encourages continued saving'
  ],
  businessValue: 'Progress visibility increases goal completion rate'
})
export class ClearProgressTrackingExpectation {}

@Expectation({
  name: 'Goal Achievement Celebration',
  description: 'Given goal achieved, When celebrating, Then memorable experience',
  provider: MobileAppBackendServiceStakeholder,
  consumer: FamilyPrimaryAccountHolderStakeholder,
  exchange: {
    inputs: [
      'Completed goal details',
      'Achievement data',
      'User celebration preferences'
    ],
    outputs: [
      'Celebration animation/notification',
      'Achievement badge',
      'Share options (social media, etc.)',
      'Prompt to create new goal'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Goal is 100% achieved',
      'Goal completion verified',
      'User session active'
    ],
    postconditions: [
      'Celebration displayed in app',
      'Badge awarded and visible',
      'User can share achievement',
      'New goal creation prompted'
    ],
    constraints: {
      maxLatency: '< 2 seconds for celebration display',
      availability: '99.5%',
      security: ['Sharing respects privacy settings'],
      custom: {
        sharing: 'Optional sharing',
        experience: 'Memorable experience design'
      }
    }
  },
  behaviors: [CelebrateAchievementBehavior],
  priority: ExpectationPriority.Low,
  acceptanceCriteria: [
    'Achievement celebration shown in app',
    'Option to share achievement (optional)',
    'Prompt to create new goal',
    'Achievement badge awarded'
  ],
  businessValue: 'Celebration creates positive emotional connection and encourages new goals'
})
export class GoalAchievementCelebrationExpectation {}

@Expectation({
  name: 'Sophisticated AI Insights',
  description: 'Given complex financial situation, When using AI insights, Then actionable guidance',
  provider: MobileAppBackendServiceStakeholder,
  consumer: ActiveSeniorInvestorStakeholder,
  exchange: {
    inputs: [
      'Multiple financial goals',
      'Investment portfolio data',
      'Tax situation and preferences',
      'Income level and risk tolerance'
    ],
    outputs: [
      'Prioritized goal recommendations',
      'Tax-advantaged savings suggestions',
      'Investment opportunity analysis',
      'Personalized action plan',
      'Risk-adjusted recommendations'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'User has multiple goals or complex finances',
      'Investment data available',
      'AI insights engine operational'
    ],
    postconditions: [
      'Sophisticated insights provided',
      'Tax optimization suggested',
      'Investment opportunities highlighted',
      'Actionable guidance delivered'
    ],
    constraints: {
      maxLatency: '< 5 seconds for complex analysis',
      availability: '99.5%',
      security: ['Investment data encrypted', 'Tax information protected'],
      custom: {
        optimization: 'Multi-goal optimization',
        taxAdvantage: 'Tax-advantaged recommendations'
      }
    }
  },
  behaviors: [GenerateAIRecommendationBehavior, SendAINudgesBehavior],
  priority: ExpectationPriority.Medium,
  acceptanceCriteria: [
    'AI considers multiple goals and priorities',
    'Tax-advantaged savings options suggested',
    'Investment opportunities highlighted',
    'Personalized to income level and risk tolerance'
  ],
  businessValue: 'Sophisticated AI insights attract and retain mass affluent customers'
})
export class SophisticatedAIInsightsExpectation {}
