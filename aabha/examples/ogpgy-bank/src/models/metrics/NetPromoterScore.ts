import { Metric, MetricCategory } from 'aabha';

/**
 * Net Promoter Score (NPS)
 * Key customer satisfaction metric for OgPgyBank
 */
@Metric({
  name: 'Net Promoter Score',
  description: 'Customer loyalty and satisfaction metric measuring likelihood to recommend OgPgyBank',
  category: MetricCategory.Customer,
  target: 65,
  baseline: 42,
  currentValue: 42,
  unit: 'score',
  direction: 'higher-is-better',
  calculation: 'Percentage of Promoters (9-10) minus Percentage of Detractors (0-6)',
  frequency: 'monthly',
  measurementMethod: 'Customer survey asking "How likely are you to recommend OgPgyBank to a friend or colleague?" on 0-10 scale',
  dataSource: {
    system: 'Customer Feedback Platform',
    endpoint: '/api/metrics/nps',
    refreshFrequency: 'monthly'
  },
  goal: {
    goal: 'Increase NPS from 42 to 65 by end of 2025',
    businessValue: 'Higher NPS correlates with customer retention, growth, and profitability'
  },
  thresholds: {
    warning: 50,
    critical: 40,
    healthy: 70
  },
  owner: 'Michael Santos - Chief Customer Officer',
  tags: [
    'customer-satisfaction',
    'kpi',
    'strategic',
    'loyalty',
    'customer-experience'
  ]
})
export class NetPromoterScore {}


