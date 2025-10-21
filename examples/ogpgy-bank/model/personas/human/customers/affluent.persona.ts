/**
 * Affluent Customer Personas
 *
 * High Net Worth Individuals (HNWI) and Mass Affluent customers who expect
 * premium service, personalized advice, and exclusive access.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Victoria Zhang - High Net Worth Individual',
  age: '58',
  occupation: 'Founder & CEO of successful tech company',
  goals: [
    'Grow and preserve wealth across generations',
    'Receive proactive, sophisticated financial advice',
    'Access exclusive investment opportunities',
    'Estate planning and wealth transfer to children',
    'Concierge banking services globally',
  ],
  painPoints: [
    'Previous bank treated her like a transaction, not a person',
    'Generic advice not tailored to her unique situation',
    'Lack of proactive outreach from wealth advisors',
    'Fragmented experience across banking services',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'dedicated relationship manager',
    'mobile app for convenience',
    'exclusive banking centers',
  ],
  extensions: {
    netWorth: 'GD$45 million',
    bankingNeeds: [
      'Wealth management',
      'Estate planning',
      'Investment advisory',
      'Concierge services',
      'Multi-currency accounts',
      'Credit facilities',
    ],
    expectation: 'Proactive advice, exclusive access, seamless global banking',
    relationship: 'Values personal relationship with dedicated wealth advisor',
    quote:
      '"I don\'t need a bank - I need a trusted financial partner who knows me and my goals"',
    opportunity:
      "OgPgyBank's community-first heritage can create genuine personal connection",
    businessImpact:
      'HNWI customers are highly profitable and provide referrals',
    successMetrics:
      'AUM growth, retention rate, share of wallet, referral rate',
  },
})
export class VictoriaZhangPersona {}

@Persona({
  name: 'Richard Blackwood - Business Executive',
  age: '52',
  occupation: "COO of Genai's largest telecom company",
  goals: [
    'Optimize portfolio for tax efficiency',
    'Mortgage for vacation property',
    'Retirement planning with spouse',
    "Children's trust funds and education",
    'Balance work demands with financial management',
  ],
  painPoints: [
    'Too busy to manage finances actively',
    'Wants expert advice but maintains control',
    'Needs banking that respects his time',
    'Frustrated by generic investment recommendations',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'mobile app for routine transactions',
    'video call with advisor for complex decisions',
    'email for detailed planning',
  ],
  extensions: {
    income: 'GD$850,000/year',
    family: 'Wife (also high earner), 2 adult children',
    bankingNeeds: [
      'Portfolio management',
      'Tax optimization',
      'Mortgage for vacation property',
      'Trust and estate services',
    ],
    preference: 'Digital-first but wants human advisor for complex decisions',
    timeConstraint: 'Extremely time-poor - values efficiency',
    quote:
      '"I need a wealth advisor who understands that my time is more valuable than money"',
    opportunity:
      'Hybrid model: digital tools + expert human advice when needed',
    successMetrics:
      'Wallet share, advisory engagement, portfolio performance, NPS',
  },
})
export class RichardBlackwoodPersona {}

@Persona({
  name: 'Dr. Alicia Fernandez - Medical Professional',
  age: '42',
  occupation: 'Cardiologist at Genai General Hospital',
  goals: [
    'Build wealth for early retirement',
    "Fund children's international education",
    'Diversify investments beyond savings',
    'Achieve financial independence',
  ],
  painPoints: [
    'High income but lacks investment knowledge',
    'Traditional wealth management requires millions in assets',
    'Intimidated by investment complexity',
    'No time to research investment options',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['mobile app', 'web banking', 'video advisory'],
  extensions: {
    income: 'GD$280,000/year',
    bankingNeeds: [
      'Savings',
      'Investments',
      'Education planning',
      'Retirement planning',
      'Home loan',
    ],
    techSavviness: 'Early adopter of digital services',
    goal: "Build wealth for retirement and children's education abroad",
    opportunity:
      'Democratized wealth management - advisory for mass affluent, not just ultra-rich',
    quote:
      '"I can perform heart surgery but I don\'t know how to build an investment portfolio"',
    successMetrics:
      'Wealth advisory adoption, AUM growth, investment product take-up',
    marketSegment: 'Mass affluent - underserved by traditional private banking',
  },
})
export class DrAliciaFernandezPersona {}
