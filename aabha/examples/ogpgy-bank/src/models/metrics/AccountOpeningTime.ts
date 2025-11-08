import { Metric, MetricCategory } from 'aabha';

/**
 * Account Opening Time
 * Time to complete account opening process
 */
@Metric({
  name: 'Account Opening Time',
  description: 'Time from application start to account activation',
  category: MetricCategory.Operational,
  target: 3,
  baseline: 5,
  currentValue: 5,
  unit: 'minutes',
  direction: 'lower-is-better',
  calculation: 'Average time from application submission to account activation',
  frequency: 'daily',
  measurementMethod: 'Automated tracking of application timestamps',
  dataSource: {
    system: 'Account Management System',
    endpoint: '/api/metrics/account-opening-time',
    refreshFrequency: 'real-time'
  },
  goal: {
    goal: 'Maintain instant account opening at < 3 minutes',
    businessValue: 'Faster onboarding improves conversion and customer satisfaction'
  },
  thresholds: {
    warning: 10,
    critical: 15,
    healthy: 3
  },
  owner: 'Lisa Wong - Chief Digital Officer',
  history: {
    trend: 'improving'
  },
  tags: [
    'operational',
    'onboarding',
    'efficiency',
    'customer-experience'
  ]
})
export class AccountOpeningTime {}


