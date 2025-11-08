import { BusinessInitiative } from 'aabha';
import { DigitalTransformationStrategy } from '../strategy/DigitalTransformationStrategy.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';
import { NetPromoterScore } from '../metrics/NetPromoterScore.js';

/**
 * Instant Account Opening Initiative
 * Business initiative to enable instant digital account opening
 * (reduced from 5 days to 5 minutes)
 */
@BusinessInitiative({
  name: 'Instant Account Opening',
  description: 'Enable customers to open accounts digitally in under 5 minutes, down from 5 days',
  strategy: DigitalTransformationStrategy,
  objectives: [
    'Reduce account opening time from 5 days to < 5 minutes',
    'Enable 100% digital account opening process',
    'Improve conversion rate by 40%',
    'Increase customer satisfaction for onboarding experience'
  ],
  outcomes: [
    'Customers can open accounts instantly via mobile app',
    'No branch visit required for account opening',
    'Real-time identity verification',
    'Immediate account activation'
  ],
  metrics: [
    AccountOpeningTime,
    NetPromoterScore
  ],
  timeline: {
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    milestones: [
      {
        name: 'MVP Launch',
        targetDate: '2024-03-31'
      },
      {
        name: 'Full Launch',
        targetDate: '2024-06-30'
      }
    ]
  },
  budget: {
    amount: 2500000,
    currency: 'GD$',
    breakdown: {
      development: 1500000,
      infrastructure: 200000,
      marketing: 500000,
      operations: 200000,
      training: 100000
    }
  },
  
  owner: 'Lisa Wong - Chief Digital Officer',
  team: [
    'Digital Product Team',
    'Engineering Team',
    'Compliance Team',
    'Customer Experience Team'
  ],
  successCriteria: [
    'Account opening time < 5 minutes',
    'Conversion rate > 60%',
    'Customer satisfaction score > 4.5/5',
    'Zero compliance incidents'
  ],
  risks: [
    {
      risk: 'KYC/AML compliance requirements may slow process',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Early engagement with compliance team and regulatory bodies'
    },
    {
      risk: 'Technical complexity of real-time verification',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Phased rollout with proven identity verification vendors'
    }
  ],
  tags: [],  // TODO: Add categorization tags
  journeys: [],  // TODO: Add @Journey decorated classes
})
export class InstantAccountOpeningInitiative {}


