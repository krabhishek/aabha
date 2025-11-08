import { Metric, MetricCategory } from 'aabha';

/**
 * Digital Active Users
 * Number of customers actively using digital banking channels
 */
@Metric({
  name: 'Digital Active Users',
  description: 'Monthly active users of mobile app and web banking',
  category: MetricCategory.Business,
  target: 2000000,
  baseline: 1200000,
  currentValue: 1200000,
  unit: 'users',
  direction: 'higher-is-better',
  calculation: 'Count of unique users who logged into mobile app or web banking in the past 30 days',
  frequency: 'monthly',
  measurementMethod: 'Analytics tracking from mobile app and web platforms',
  dataSource: {
    system: 'Digital Analytics Platform',
    endpoint: '/api/metrics/digital-active-users',
    refreshFrequency: 'daily'
  },
  goal: {
    goal: 'Grow active digital users from 1.2M to 2.0M by end of 2025',
    businessValue: 'Digital engagement drives customer retention and reduces operational costs'
  },
  thresholds: {
    warning: 1500000,
    critical: 1000000,
    healthy: 2500000
  },
  owner: 'Lisa Wong - Chief Digital Officer',
  tags: [
    'business',
    'growth',
    'digital-transformation',
    'kpi',
    'engagement'
  ]
})
export class DigitalActiveUsers {}


