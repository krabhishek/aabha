/**
 * OgPgyBank Digital Transformation Strategy (2024-2027)
 *
 * Strategic vision: "To become Genai's most loved bank and a globally recognized
 * banking powerhouse by delivering world-class customer experiences powered by
 * technology, while staying true to our roots of financial inclusion."
 *
 * CEO: Sarah Nakamura
 */

import { Strategy } from '../../../../src/index.js';
import {
  AccountOpeningTime,
  CostToIncomeRatio,
  CriticalComplianceIncidents,
  CustomerAcquisitionCost,
  CustomerEffortScore,
  DigitalAdoptionRate,
  FraudDetectionRate,
  MobileActiveUsers,
  MobileAppRating,
  NetPromoterScore,
  OperationalCostReduction,
  PaymentProcessingTime,
  SMEBankingPortfolioGrowth,
  WealthManagementAUMGrowth,
} from './metrics.js';

@Strategy({
  name: 'Digital Banking Transformation 2024-2027',
  whereToPlay: [
    'Retail Banking - 3.2M customers (38% of Genai population)',
    'SME Banking - Small & Medium Enterprises across Genai',
    'Wealth Management - Mass affluent and high net worth individuals',
    'Digital Channels - Mobile and web as primary touchpoints',
  ],
  howToWin:
    'Most trusted digital banking experience combined with OgPgyBank\'s community-first heritage - delivering world-class customer experiences while maintaining the "Original Guardian" spirit',
  coreCapabilities: [
    'Real-time transaction processing and instant account opening',
    'AI-powered financial insights and personalized recommendations',
    'Seamless omnichannel experience (mobile, web, branch)',
    'Proactive compliance and risk management as competitive advantage',
    'Data-driven personalization at scale',
    'Human + Digital hybrid model empowering branch staff',
  ],
  managementSystems: [
    'OKR tracking for transformation initiatives',
    'Customer feedback loops (Voice of Customer program - 50K+ feedback/month)',
    'Agile squad model for cross-functional delivery',
    'Real-time metrics dashboards for all levels',
    'Weekly CEO "listen tours" to branches',
    'Monthly "Hack OgPgyBank" security competitions',
  ],
  metrics: [
    NetPromoterScore,
    CustomerEffortScore,
    MobileAppRating,
    AccountOpeningTime,
    MobileActiveUsers,
    DigitalAdoptionRate,
    SMEBankingPortfolioGrowth,
    WealthManagementAUMGrowth,
    FraudDetectionRate,
    PaymentProcessingTime,
    CriticalComplianceIncidents,
    OperationalCostReduction,
    CustomerAcquisitionCost,
    CostToIncomeRatio,
  ],
  timeHorizon: '2024-2027 (3-year transformation)',
  risks: [
    {
      risk: 'Core banking migration delays',
      mitigation: 'Phased rollout approach, currently 60% complete',
      impact: 'high',
    },
    {
      risk: 'Customer adoption resistance (especially seniors)',
      mitigation:
        'Digital skills training, maintain branch network, assisted digital services',
      impact: 'medium',
    },
    {
      risk: 'Cybersecurity threats during transformation',
      mitigation:
        'Zero-trust architecture, continuous security testing, CISO-led security culture',
      impact: 'high',
    },
    {
      risk: 'Talent retention and digital skills gap',
      mitigation:
        'Reskilling 8,200 employees, competitive compensation, innovation culture',
      impact: 'high',
    },
    {
      risk: 'Neobank competition (NeoBrightBank and others)',
      mitigation:
        'Speed to market, superior customer experience, trust advantage from 70+ year heritage',
      impact: 'high',
    },
    {
      risk: 'Regulatory changes and compliance burden',
      mitigation:
        'Proactive regulator engagement, compliance as competitive advantage strategy',
      impact: 'medium',
    },
  ],
  extensions: {
    backstory:
      'Founded 1952 by three friends who believed every Genai citizen deserves a safe place to save. Lost 120K customers in Q2 2022 to NeoBrightBank - the wake-up call for transformation.',
    wakeUpCall:
      'Q2 2022: Lost 120,000 customers to NeoBrightBank (challenger bank with instant account opening and AI-powered advice)',
    transformation_pillars: [
      '1. Customer Experience First - Design every journey with customer at center',
      '2. Digital Core - Modern banking platform on microservices',
      '3. Human + Digital - Augment branch staff with digital tools',
      '4. Compliance as Competitive Advantage - Proactive risk management',
      '5. Innovation Culture - Build, measure, learn mindset',
    ],
    progress_q4_2024: [
      '✅ New mobile app launched (4.8 stars, 500K downloads)',
      '✅ Instant account opening (5 days → 5 minutes)',
      '✅ AI-powered savings assistant launched',
      '✅ Open banking APIs released',
      '🔄 Core banking migration (60% complete)',
      '🔄 Branch digitization (Phase 2 of 4)',
      '📅 Wealth management platform (planned Q1 2025)',
    ],
    leadership:
      'CEO Sarah Nakamura (52) - Former Regional Head at HSBC Asia, philosophy: "Banking should be invisible. Experiences should be magical."',
    market_position:
      '#2 in Genai by assets (GD$125B), #1 by customer satisfaction as of 2024',
  },
})
export class DigitalTransformationStrategy {}
