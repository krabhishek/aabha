/**
 * Young Adult Customer Personas
 *
 * University students and young professionals - digital natives who expect
 * seamless mobile experiences and will switch banks if UX disappoints.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Marcus Lee - Young Professional',
  age: '26',
  occupation: 'Junior Software Developer',
  goals: [
    'Build savings for future (house, investments)',
    'Simple, fast banking that "just works"',
    'Start investing without complexity',
    'Track spending and budget easily',
  ],
  painPoints: [
    'Traditional banks feel "old and slow"',
    'Complex processes and paperwork',
    'Poor mobile app experiences',
    'Lack of financial guidance for first-time investors',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['mobile app', 'web banking'],
  extensions: {
    income: 'GD$48,000/year',
    bankingNeeds: ['Salary account', 'Savings', 'Investment options'],
    behavior: 'Never visited a branch, does everything on mobile',
    riskLevel: 'High risk of switching to neobank if experience disappoints',
    opportunity: 'First banking relationship - high lifetime value if captured',
    quote:
      '"If my banking app is slower than my code compiler, I\'m switching banks"',
    successMetrics: 'App rating, feature adoption, retention rate',
  },
})
export class MarcusLeePersona {}

@Persona({
  name: 'Zara Ahmed - University Student',
  age: '21',
  occupation: 'Business Administration Student at Genai National University',
  goals: [
    'Manage limited budget effectively',
    'Save money from part-time job and allowance',
    'Learn financial responsibility',
    'Access banking services 24/7 on mobile',
  ],
  painPoints: [
    'Limited income requires careful budgeting',
    'Confusing bank fees and charges',
    'Intimidated by traditional bank branches',
    'No financial education from traditional banks',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['mobile app only'],
  extensions: {
    income: 'GD$12,000/year (part-time + allowance)',
    bankingNeeds: [
      'Basic savings account',
      'Debit card',
      'Mobile banking',
      'Zero/low fees',
    ],
    behavior: 'Never visited a branch, expects mobile-first experience',
    opportunity: 'First banking relationship - high lifetime value potential',
    parentalInfluence:
      'Parents may be OgPgyBank customers - family connection opportunity',
    quote: '"Why would I go to a branch when I can do everything on my phone?"',
    successMetrics: 'Account opening conversion, app engagement, referral rate',
  },
})
export class ZaraAhmedPersona {}
