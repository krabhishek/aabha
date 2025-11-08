import { Metric, MetricCategory } from 'aabha';

/**
 * Customer Effort Score (CES)
 * Measures how easy it is for customers to complete banking tasks
 */
@Metric({
  name: 'Customer Effort Score',
  description: 'Measures customer effort required to complete banking interactions',
  category: MetricCategory.Customer,
  target: 1.8,
  baseline: 3.2,
  currentValue: 3.2,
  unit: 'score',
  direction: 'lower-is-better',
  calculation: 'Average score from 1-5 scale (1=very easy, 5=very difficult)',
  frequency: 'weekly',
  measurementMethod: 'Post-interaction survey asking "How easy was it to complete this task?"',
  dataSource: {
    system: 'Customer Feedback Platform',
    endpoint: '/api/metrics/ces',
    refreshFrequency: 'weekly'
  },
  goal: {
    goal: 'Reduce average CES from 3.2 to 1.8 by end of 2025',
    businessValue: 'Lower effort correlates with higher satisfaction and loyalty'
  },
  thresholds: {
    warning: 2.5,
    critical: 3.5,
    healthy: 1.5
  },
  owner: 'Michael Santos - Chief Customer Officer',
  tags: [
    'customer-satisfaction',
    'kpi',
    'customer-experience',
    'strategic'
  ]
})
export class CustomerEffortScore {}


