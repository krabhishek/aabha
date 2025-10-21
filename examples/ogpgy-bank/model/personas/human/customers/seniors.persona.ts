/**
 * Senior Citizen Customer Personas
 *
 * Loyal long-term customers who value personal relationships but are at risk
 * of being left behind in digital transformation. Need assisted digital services.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: "Margaret O'Connor - Loyal Retiree",
  age: '72',
  occupation: 'Retired School Teacher',
  goals: [
    'Manage retirement savings safely',
    'Receive pension payments reliably',
    'Maintain relationship with trusted bank',
    'Learn new banking technology at her own pace',
  ],
  painPoints: [
    'Afraid of being left behind in digital transformation',
    'Intimidated by mobile apps and online banking',
    'Worried about security and fraud',
    'Values human interaction that digital lacks',
  ],
  technicalProficiency: 'low',
  preferredChannels: [
    'branch visits',
    'phone banking',
    'gradually learning mobile',
  ],
  extensions: {
    income: 'GD$35,000/year (pension)',
    bankingNeeds: [
      'Retirement account management',
      'Fixed deposits',
      'Pension payments',
      'Safe savings',
    ],
    loyalty: 'OgPgyBank customer for 45 years - deeply emotional connection',
    backstory:
      'Remembers when OgPgyBank helped her count coins in piggy bank as child',
    concern:
      '"I don\'t want to be forced to use technology I don\'t understand"',
    opportunity:
      'Assisted digital services + patient staff training can bridge gap',
    brandAmbassador:
      'Will advocate for OgPgyBank if treated with respect and patience',
    quote:
      '"OgPgyBank has been my financial guardian for 45 years - I just hope they don\'t forget about people like me"',
    successMetrics:
      'Retention rate, assisted digital adoption, satisfaction scores',
    riskLevel: 'At risk of leaving if forced into digital-only without support',
  },
})
export class MargaretOConnorPersona {}

@Persona({
  name: 'William Chen - Active Senior',
  age: '68',
  occupation: 'Retired Business Owner, Part-time Consultant',
  goals: [
    'Manage investment portfolio actively',
    'Stay financially independent',
    'Travel internationally with ease',
    'Learn and adopt new technology',
  ],
  painPoints: [
    'Some digital features not intuitive for older users',
    'Font sizes and UI not senior-friendly',
    'Needs more time to learn new features than younger users',
    'Wants personal advisor for complex decisions',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'internet banking (learning mobile app)',
    'branch for complex needs',
    'relationship manager',
  ],
  extensions: {
    income: 'GD$65,000/year (consulting fees + investment income)',
    bankingNeeds: [
      'Investment portfolio',
      'Estate planning',
      'Travel money',
      'Multi-currency accounts',
    ],
    techAdoption:
      'Curious and willing to learn - uses internet banking, learning mobile app',
    characteristic:
      'Growth mindset - "I can learn this if you teach me patiently"',
    quote:
      '"I built a business - I can certainly learn to use a banking app. Just give me clear instructions"',
    opportunity:
      'Senior-friendly UX + digital literacy training = digital champion among peers',
    influencer:
      'Respected in community - successful digital adoption leads to peer referrals',
    successMetrics: 'Digital adoption rate, wealth management engagement, NPS',
  },
})
export class WilliamChenPersona {}
