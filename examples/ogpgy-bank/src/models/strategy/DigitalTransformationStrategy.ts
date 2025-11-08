import { Strategy } from 'aabha';
import { NetPromoterScore } from '../metrics/NetPromoterScore.js';
import { DigitalActiveUsers } from '../metrics/DigitalActiveUsers.js';
import { CustomerEffortScore } from '../metrics/CustomerEffortScore.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * OgPgyBank Digital Transformation Strategy
 * The strategic framework guiding OgPgyBank's transformation to become
 * Genai's most loved bank and a globally recognized banking powerhouse
 */
@Strategy({
  name: 'Digital Transformation and Customer Experience Excellence',
  description: 'Strategic transformation to become Genai\'s most loved bank by delivering world-class customer experiences powered by technology, while staying true to roots of financial inclusion',
  winningAspiration: 'To become Genai\'s most loved bank and a globally recognized banking powerhouse by delivering world-class customer experiences powered by technology, while staying true to our roots of financial inclusion',
  whereToPlay: [
    'Retail banking (mass market and mass affluent)',
    'Digital banking channels (mobile and web)',
    'SME banking',
    'Wealth management (expanding to mass affluent)',
    'Open banking ecosystem'
  ],
  howToWin: 'Customer Experience First - Design every journey with customer at center. Digital Core - Modern banking platform with real-time data and AI-driven insights. Human + Digital - Augment branch staff with digital tools, empower relationship managers with data. Compliance as Competitive Advantage - Proactive risk management and real-time regulatory reporting. Innovation Culture - Build, measure, learn mindset with cross-functional squads',
  coreCapabilities: [
    'Real-time data processing and AI/ML platforms',
    'API-first architecture for ecosystem partnerships',
    'Microservices-based modern banking platform',
    'Customer-centric journey design',
    'Proactive risk management and compliance',
    'Digital-first product development'
  ],
  managementSystems: [
    'OKRs (Objectives and Key Results)',
    'Agile development methodology',
    'Continuous customer feedback loops',
    'Data-driven decision making',
    'Cross-functional squad structure'
  ],
  objectives: [
    'Reduce customer effort score from 3.2 to 1.8',
    'Increase NPS from 42 to 65',
    'Grow active digital users from 1.2M to 2.0M',
    'Complete core banking migration (currently 60%)',
    'Launch personalized financial wellness platform',
    'Achieve 95% fraud detection rate (from 78%)'
  ],
  metrics: [
    NetPromoterScore,
    DigitalActiveUsers,
    CustomerEffortScore,
    AccountOpeningTime
  ],
  timeHorizon: '2024-2027',
  owner: 'Sarah Nakamura - CEO',
  reviewCycle: 'Quarterly',
  lastReviewed: '2024-10-01',
  nextReview: '2025-01-01',
  risks: [
    {
      risk: 'Transformation investment may not deliver expected ROI',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Regular ROI reviews and course correction'
    },
    {
      risk: 'Customer churn to neobanks continues during transformation',
      likelihood: 'high',
      impact: 'high',
      mitigation: 'Accelerate digital initiatives and improve customer experience'
    },
    {
      risk: 'Legacy system migration complexity delays digital initiatives',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Phased migration approach with parallel systems'
    }
  ],
  assumptions: [
    'Customers value digital-first experiences',
    'Mobile app adoption will continue to grow',
    'Regulatory environment remains stable',
    'Technology platform can scale to support growth',
    'Competitive pressure from neobanks will continue'
  ],
  strategicChoices: {
    focus: [
      'Digital-first customer experience',
      'Mobile and web banking excellence',
      'Real-time data and AI-driven insights',
      'Proactive relationship management'
    ],
    deliberateExclusions: [
      'Legacy branch expansion',
      'Traditional paper-based processes',
      'Reactive customer service model',
      'Siloed product development'
    ]
  },
  valueProposition: 'Instant, personalized financial services that adapt to your life, powered by AI and delivered through world-class digital experiences, while maintaining the trust and reliability of a traditional bank',
  competitiveContext: 'Fintech disruption accelerating, increasing mobile adoption (85% of customers now mobile-first), regulatory changes favoring digital banking, neobanks capturing market share with superior UX, customers expecting real-time insights and personalized experiences, traditional banks struggling with legacy systems'
})
export class DigitalTransformationStrategy {}


