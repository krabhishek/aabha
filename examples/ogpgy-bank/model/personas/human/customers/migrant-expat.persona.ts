/**
 * Migrant Worker & Expat Customer Personas
 *
 * International customers who need cross-border banking, remittances,
 * and multi-currency services.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Elena Popescu - Migrant Worker',
  age: '34',
  occupation: 'Healthcare Worker from Romania',
  goals: [
    'Send money home to family reliably and affordably',
    'Save for eventual return home or bring family to Genai',
    'Access banking services despite language barriers',
    'Build financial security in new country',
  ],
  painPoints: [
    'High remittance fees eat into savings (monthly GD$800 to Romania)',
    'Exchange rate markups are opaque',
    'Difficult to navigate banking in non-native language',
    'Feels underserved by traditional banks',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'mobile app (with translation)',
    'branch staff who speak Romanian or are patient',
  ],
  extensions: {
    income: 'GD$42,000/year',
    remittances: 'GD$800/month to family in Romania (23% of income)',
    bankingNeeds: [
      'Salary account',
      'Low-cost remittance',
      'Multi-currency account',
      'Language support',
    ],
    painPointDetail:
      'Pays GD$40-60 per month in remittance fees - seeking cheaper alternative',
    opportunity: 'Fair, transparent international money transfers',
    quote: '"Every dollar I save on fees is a dollar I can send to my family"',
    loyaltyDriver:
      'Affordable remittances + respectful service = strong loyalty and referrals to community',
    communityInfluence:
      'Part of tight-knit Romanian community - word-of-mouth powerful',
    successMetrics:
      'Remittance volume, fee revenue (but competitive), retention, community referrals',
  },
})
export class ElenaPopescuPersona {}

@Persona({
  name: 'James Anderson - Expat Professional',
  age: '45',
  occupation:
    'Finance Director at multinational company (3-year assignment in Genai)',
  goals: [
    'Seamless banking across Genai and USA',
    'Multi-currency accounts for international life',
    "Mortgage in Genai (company doesn't provide housing)",
    'Investment portfolio accessible globally',
    'Eventually repatriate savings to USA',
  ],
  painPoints: [
    'Managing finances across two countries is complex',
    'Currency exchange fees add up quickly',
    'Difficult to get mortgage as expat',
    'Wants banking relationship that continues after Genai assignment',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'mobile app',
    'web banking',
    'video calls with relationship manager',
  ],
  extensions: {
    income: 'GD$220,000/year + expat package',
    tenure: '3-year assignment (2024-2027)',
    bankingNeeds: [
      'Multi-currency account',
      'International transfers',
      'Mortgage',
      'Investments',
      'Tax planning',
    ],
    needDetail: 'Seamless access to funds in USD, GD$, and EUR',
    familySituation: 'Spouse and 2 children relocated to Genai',
    opportunity: 'Premium expat banking services + global network',
    quote:
      "\"I need banking that doesn't care which country I'm in - just that I'm a valued customer\"",
    businessImpact:
      'High-value customer + multinational company banking relationship',
    successMetrics:
      'Wallet share, mortgage conversion, investment product take-up, retention post-assignment',
  },
})
export class JamesAndersonPersona {}
