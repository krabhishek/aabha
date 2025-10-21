/**
 * Strategic Metrics for OgPgyBank Digital Transformation
 *
 * These metrics track progress towards OgPgyBank's 2024-2027 transformation goals
 * as outlined in the digital transformation strategy.
 */

import { Metric } from '../../../../src/index.js';

// ============================================================================
// Customer Experience Metrics
// ============================================================================

@Metric({
  name: 'Net Promoter Score (NPS)',
  target: 65,
  unit: 'points',
  thresholds: { healthy: 60, warning: 50, critical: 40 },
  calculation: '(% Promoters - % Detractors)',
  frequency: 'monthly',
  dataSource: {
    system: 'Customer Feedback Platform',
    endpoint: '/api/metrics/nps'
  },
  baseline: 42,
  owner: 'Michael Santos, Chief Customer Officer',
  extensions: {
    backstory: 'Current NPS is 42, target is 65 by end of 2025',
    goal: 'Increase from #2 to #1 in customer satisfaction in Genai'
  }
})
export class NetPromoterScore {}

@Metric({
  name: 'Customer Effort Score',
  target: 1.8,
  unit: 'score',
  thresholds: { healthy: 2.0, warning: 2.5, critical: 3.0 },
  calculation: 'Average of "How easy was it to complete your task?" (1-5 scale)',
  frequency: 'real-time',
  dataSource: {
    system: 'Customer Feedback Platform',
    endpoint: '/api/metrics/ces'
  },
  baseline: 3.2,
  owner: 'Michael Santos, Chief Customer Officer',
  extensions: {
    backstory: 'Target: reduce from 3.2 to 1.8 in 2025',
    goal: 'Measure friction in every customer interaction'
  }
})
export class CustomerEffortScore {}

@Metric({
  name: 'Mobile App Rating',
  target: 4.8,
  unit: 'stars',
  thresholds: { healthy: 4.7, warning: 4.5, critical: 4.3 },
  calculation: 'Average rating from app stores (iOS + Android)',
  frequency: 'daily',
  dataSource: {
    system: 'App Store Analytics',
    endpoint: '/api/metrics/app-rating'
  },
  baseline: 4.8,
  owner: 'Lisa Wong, Chief Digital Officer',
  extensions: {
    backstory: 'Already achieved 4.8 stars with 500K downloads',
    goal: 'Maintain excellence as user base grows to 2M'
  }
})
export class MobileAppRating {}

@Metric({
  name: 'Account Opening Time',
  target: 5,
  unit: 'minutes',
  thresholds: { healthy: 5, warning: 10, critical: 15 },
  calculation: 'Time from start to account activation',
  frequency: 'real-time',
  dataSource: {
    system: 'Core Banking System',
    endpoint: '/api/metrics/account-opening-time'
  },
  baseline: 7200, // 5 days in minutes
  owner: 'Michael Santos, Chief Customer Officer',
  extensions: {
    backstory: 'Reduced from 5 days (7200 min) to 5 minutes - 99.93% improvement',
    goal: 'Instant account opening competitive advantage'
  }
})
export class AccountOpeningTime {}

// ============================================================================
// Business Growth Metrics
// ============================================================================

@Metric({
  name: 'Mobile Active Users',
  target: 2000000,
  unit: 'users',
  thresholds: { healthy: 1800000, warning: 1500000, critical: 1200000 },
  calculation: 'Monthly active users (MAU) on mobile app',
  frequency: 'daily',
  dataSource: {
    system: 'Analytics Platform',
    endpoint: '/api/metrics/mobile-active-users'
  },
  baseline: 1200000,
  owner: 'Lisa Wong, Chief Digital Officer',
  extensions: {
    backstory: 'Grow from 1.2M to 2.0M active digital users in 2025',
    goal: 'Make mobile the primary banking channel'
  }
})
export class MobileActiveUsers {}

@Metric({
  name: 'Digital Adoption Rate',
  target: 60,
  unit: '%',
  thresholds: { healthy: 55, warning: 45, critical: 35 },
  calculation: '(Digital transactions / Total transactions) * 100',
  frequency: 'daily',
  dataSource: {
    system: 'Core Banking System',
    endpoint: '/api/metrics/digital-adoption'
  },
  baseline: 38,
  owner: 'Lisa Wong, Chief Digital Officer',
  extensions: {
    backstory: 'Target: 60% of transactions through digital channels',
    goal: 'Reduce branch dependency while maintaining service quality'
  }
})
export class DigitalAdoptionRate {}

@Metric({
  name: 'SME Banking Portfolio Growth',
  target: 40,
  unit: '%',
  thresholds: { healthy: 35, warning: 25, critical: 15 },
  calculation: 'YoY growth in SME banking portfolio value',
  frequency: 'quarterly',
  dataSource: {
    system: 'Financial Reporting System',
    endpoint: '/api/metrics/sme-portfolio-growth'
  },
  baseline: 12,
  owner: 'James Anderson, Head of SME Banking',
  extensions: {
    backstory: 'Launched "Business in a Box" for instant business account + payment processing',
    goal: 'SMEs are backbone of Genai economy - 40% growth target'
  }
})
export class SMEBankingPortfolioGrowth {}

@Metric({
  name: 'Wealth Management AUM Growth',
  target: 30,
  unit: '%',
  thresholds: { healthy: 25, warning: 15, critical: 10 },
  calculation: 'YoY growth in Assets Under Management',
  frequency: 'quarterly',
  dataSource: {
    system: 'Wealth Management Platform',
    endpoint: '/api/metrics/aum-growth'
  },
  baseline: 8,
  owner: 'Sophia Martinez, Head of Wealth Management',
  extensions: {
    backstory: 'Democratize wealth management through technology',
    goal: 'Expand to mass affluent segment, not just ultra-rich'
  }
})
export class WealthManagementAUMGrowth {}

// ============================================================================
// Operational Excellence Metrics
// ============================================================================

@Metric({
  name: 'Real-time Fraud Detection Rate',
  target: 95,
  unit: '%',
  thresholds: { healthy: 93, warning: 85, critical: 78 },
  calculation: '(Fraud cases detected / Total fraud cases) * 100',
  frequency: 'real-time',
  dataSource: {
    system: 'Fraud Detection System',
    endpoint: '/api/metrics/fraud-detection-rate'
  },
  baseline: 78,
  owner: 'Elena Rodriguez, Chief Risk Officer',
  extensions: {
    backstory: 'Current 78% detection rate, target 95%',
    goal: 'Compliance as competitive advantage - proactive risk management'
  }
})
export class FraudDetectionRate {}

@Metric({
  name: 'Payment Processing Time',
  target: 0,
  unit: 'seconds',
  thresholds: { healthy: 5, warning: 30, critical: 172800 }, // T+2 days
  calculation: 'Time from payment initiation to settlement',
  frequency: 'real-time',
  dataSource: {
    system: 'Payment Processing System',
    endpoint: '/api/metrics/payment-processing-time'
  },
  baseline: 172800, // T+2 in seconds
  owner: 'Thomas Murphy, Head of Finance Operations',
  extensions: {
    backstory: 'Reduced from T+2 to real-time processing',
    goal: 'Instant payment settlement for better customer experience'
  }
})
export class PaymentProcessingTime {}

@Metric({
  name: 'Critical Compliance Incidents',
  target: 0,
  unit: 'incidents',
  thresholds: { healthy: 0, warning: 1, critical: 3 },
  calculation: 'Count of critical compliance incidents per quarter',
  frequency: 'real-time',
  dataSource: {
    system: 'Compliance Management System',
    endpoint: '/api/metrics/compliance-incidents'
  },
  baseline: 2,
  owner: 'Dr. Kenji Yamamoto, Chief Compliance Officer',
  extensions: {
    backstory: 'Target: Zero critical compliance incidents in 2025',
    goal: 'Transform compliance from blocker to enabler'
  }
})
export class CriticalComplianceIncidents {}

@Metric({
  name: 'Operational Cost Reduction',
  target: 15,
  unit: '%',
  thresholds: { healthy: 12, warning: 8, critical: 5 },
  calculation: 'YoY reduction in operational costs through automation',
  frequency: 'quarterly',
  dataSource: {
    system: 'Financial Reporting System',
    endpoint: '/api/metrics/operational-cost-reduction'
  },
  baseline: 0,
  owner: 'Priya Sharma, Chief Operating Officer',
  extensions: {
    backstory: 'Reduce operational costs by 15% through automation',
    goal: 'Operational excellence creates capacity for innovation'
  }
})
export class OperationalCostReduction {}

// ============================================================================
// Financial Metrics
// ============================================================================

@Metric({
  name: 'Customer Acquisition Cost',
  target: 45,
  unit: 'GD$',
  thresholds: { healthy: 50, warning: 75, critical: 100 },
  calculation: 'Total marketing & sales cost / New customers acquired',
  frequency: 'monthly',
  dataSource: {
    system: 'CRM & Financial System',
    endpoint: '/api/metrics/cac'
  },
  baseline: 85,
  owner: 'Jennifer Tan, Chief Marketing Officer',
  extensions: {
    backstory: 'Digital channels reduce CAC vs traditional branch acquisition',
    goal: 'Efficient growth through digital marketing and word-of-mouth'
  }
})
export class CustomerAcquisitionCost {}

@Metric({
  name: 'Cost-to-Income Ratio',
  target: 45,
  unit: '%',
  thresholds: { healthy: 50, warning: 60, critical: 70 },
  calculation: '(Operating costs / Operating income) * 100',
  frequency: 'quarterly',
  dataSource: {
    system: 'Financial Reporting System',
    endpoint: '/api/metrics/cost-income-ratio'
  },
  baseline: 58,
  owner: 'Dr. Marcus Chen, Chief Financial Officer',
  extensions: {
    backstory: 'Improve efficiency while investing in transformation',
    goal: 'Profitable growth, not growth at any cost'
  }
})
export class CostToIncomeRatio {}
