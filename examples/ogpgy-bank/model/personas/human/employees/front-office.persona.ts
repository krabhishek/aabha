/**
 * Front Office Leadership Personas
 *
 * Customer-facing leadership: Customer Officer, Marketing, Retail/SME/Wealth heads.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Michael Santos - Chief Customer Officer',
  age: '43',
  occupation: 'Chief Customer Officer',
  goals: [
    'Every complaint is a gift',
    'Reduce CES from 3.2 to 1.8',
    'Increase NPS from 42 to 65',
  ],
  painPoints: [
    'Siloed customer data',
    'Friction in customer journeys',
    'Branch-digital coordination gaps',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'customer feedback dashboards',
    'branch visits',
    'call center monitoring',
  ],
  extensions: {
    background: '15 years in retail banking, customer service expert',
    oversees:
      'Customer service centers, branch network, customer experience design',
    innovation:
      'Launched "Voice of Customer" program capturing 50K+ feedback/month',
    quote: '"Every complaint is a gift—it tells us where we\'re failing"',
  },
})
export class MichaelSantosPersona {}

@Persona({
  name: 'Jennifer Tan - Chief Marketing Officer',
  age: '40',
  occupation: 'Chief Marketing Officer',
  goals: [
    'Transform brand from "grandpa\'s bank" to "Genai\'s champion"',
    'Reduce CAC',
    'Drive digital adoption',
  ],
  painPoints: [
    'Overcoming "old bank" perception',
    'Competing with neobank marketing budgets',
    'Measuring marketing ROI',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['marketing analytics', 'social media', 'brand tracking'],
  extensions: {
    background: 'Brand strategist at global agency, digital marketing pioneer',
    achievements:
      'Rebranded OgPgyBank from "your grandpa\'s bank" to "Genai\'s banking champion"',
    focus: 'Brand storytelling, digital marketing, community engagement',
    quote:
      '"Marketing is about creating emotional connections, not just transactions"',
  },
})
export class JenniferTanPersona {}

@Persona({
  name: 'Robert Chang - Head of Retail Banking',
  age: '49',
  occupation: 'Head of Retail Banking',
  goals: [
    'Digitize services while maintaining human touch',
    'Grow retail customer base',
    'Increase digital adoption',
  ],
  painPoints: [
    'Branch staff resistance to digital',
    'Customer segmentation complexity',
    'Cross-sell coordination',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'branch visits',
    'retail banking dashboards',
    'relationship manager meetings',
  ],
  extensions: {
    background: '22 years at OgPgyBank, knows every branch personally',
    philosophy:
      '"Branches aren\'t dying—they\'re evolving into advice centers"',
    oversees: 'Personal banking, savings, current accounts, debit cards',
    quote:
      '"Every branch should feel like coming home, whether physical or digital"',
  },
})
export class RobertChangPersona {}

@Persona({
  name: 'Sophia Martinez - Head of Wealth Management',
  age: '46',
  occupation: 'Head of Wealth Management',
  goals: [
    'Democratize wealth management for mass affluent',
    'Grow AUM by 30%',
    'Launch Q1 2025 platform',
  ],
  painPoints: [
    'Scaling personal advice',
    'Regulatory complexity',
    'Technology platform delays',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'wealth platform',
    'client meetings',
    'market analysis tools',
  ],
  extensions: {
    background: 'Private banker at UBS, CFP certification',
    philosophy:
      '"Wealth management should be accessible to all, not just the ultra-rich"',
    focus: 'Investment products, financial planning, advisory services',
    goal: 'Democratize wealth management through technology',
  },
})
export class SophiaMartinezPersona {}

@Persona({
  name: 'James Anderson - Head of SME Banking',
  age: '44',
  occupation: 'Head of SME Banking',
  goals: [
    'Be banking partners, not just banks',
    'Grow SME portfolio 40%',
    '"Business in a Box" success',
  ],
  painPoints: [
    'SME credit risk assessment',
    'Complex needs vs. simple processes',
    'Cash flow volatility',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'SME banking dashboards',
    'client visits',
    'industry forums',
  ],
  extensions: {
    background: 'Former small business owner, turned banker',
    philosophy:
      '"SMEs are the backbone of Genai\'s economy—they deserve banking partners, not just banks"',
    oversees: 'Business accounts, lending, merchant services',
    innovation:
      'Launched "Business in a Box" - instant business account + payment processing',
  },
})
export class JamesAndersonSMEPersona {}
