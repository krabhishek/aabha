/**
 * Middle & Back Office Leadership Personas
 *
 * Compliance, Audit, Finance Operations, Treasury, HR, Legal, Procurement, Facilities.
 */

import { Persona } from '../../../../../../src/index.js';

// Middle Office

@Persona({
  name: 'Dr. Kenji Yamamoto - Chief Compliance Officer',
  age: '55',
  occupation: 'Chief Compliance Officer',
  goals: [
    'Compliance as competitive advantage',
    'Zero critical incidents',
    'Transform from blocker to enabler',
  ],
  painPoints: [
    'Perceived as "department of no"',
    'Regulatory complexity',
    'Manual compliance processes',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'compliance dashboards',
    'regulator meetings',
    'policy reviews',
  ],
  extensions: {
    background: '25 years in banking regulation, LL.M. in Banking Law',
    philosophy:
      '"Compliance is our license to operate—and our competitive moat"',
    focus: 'Regulatory compliance, AML, KYC, policy framework',
    knownFor: 'Transforming compliance from "blocker" to "enabler"',
  },
})
export class DrKenjiYamamotoPersona {}

@Persona({
  name: 'Grace Lee - Head of Internal Audit',
  age: '47',
  occupation: 'Head of Internal Audit',
  goals: [
    'Audit as trusted advisor',
    'Continuous auditing',
    'Risk-based approach',
  ],
  painPoints: [
    'Audit seen as policing',
    'Manual audit processes',
    'Keeping pace with digital transformation',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'audit management system',
    'risk dashboards',
    'audit committee meetings',
  ],
  extensions: {
    background: 'Big 4 audit partner, CIA, CISA certifications',
    philosophy: '"Audit should be a trusted advisor, not a feared policeman"',
    approach: 'Continuous auditing with real-time monitoring',
    focus: 'Process improvement, control effectiveness, risk-based auditing',
  },
})
export class GraceLeePersona {}

@Persona({
  name: 'Thomas Murphy - Head of Finance Operations',
  age: '51',
  occupation: 'Head of Finance Operations',
  goals: [
    'Operational excellence creates innovation capacity',
    'Real-time payments',
    '15% cost reduction',
  ],
  painPoints: [
    'Legacy payment systems',
    'Reconciliation complexity',
    'Process inefficiencies',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'operations dashboards',
    'process improvement sessions',
    'vendor meetings',
  ],
  extensions: {
    background: '20 years in banking operations, Six Sigma Black Belt',
    philosophy: '"Operational excellence creates capacity for innovation"',
    oversees: 'Payments processing, reconciliation, financial reporting',
    achievement: 'Reduced payment processing time from T+2 to real-time',
  },
})
export class ThomasMurphyPersona {}

@Persona({
  name: 'Nadia Hassan - Head of Treasury',
  age: '45',
  occupation: 'Head of Treasury',
  goals: [
    'Optimize liquidity',
    'Fund growth initiatives',
    'Manage interest rate risk',
  ],
  painPoints: [
    'Volatile markets',
    'Balancing liquidity vs. returns',
    'Regulatory capital requirements',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'treasury management system',
    'market data terminals',
    'ALM models',
  ],
  extensions: {
    background: 'Trader turned treasurer, risk management expert',
    philosophy: '"Liquidity is oxygen—you don\'t notice it until it\'s gone"',
    manages: 'Liquidity, funding, capital allocation, interest rate risk',
    focus: 'Optimizing balance sheet while funding growth',
  },
})
export class NadiaHassanPersona {}

// Back Office

@Persona({
  name: 'Catherine Brown - Chief Human Resources Officer',
  age: '49',
  occupation: 'CHRO',
  goals: [
    'Reskill 8,200 employees',
    'Build customer-first culture',
    'Attract digital talent',
  ],
  painPoints: [
    'Change resistance',
    'Talent shortage in Genai',
    'Balancing transformation with employee morale',
  ],
  technicalProficiency: 'medium',
  preferredChannels: ['HR analytics', 'employee surveys', 'town halls'],
  extensions: {
    background: 'HR transformation leader, organizational psychologist',
    philosophy:
      '"Culture eats strategy for breakfast—and our culture is \'customer-first, always\'"',
    initiatives:
      'Digital skills training, agile ways of working, diversity & inclusion',
    challenge: 'Reskilling 8,200 employees for digital age',
  },
})
export class CatherineBrownPersona {}

@Persona({
  name: 'Maya Patel - Head of Legal',
  age: '46',
  occupation: 'Head of Legal',
  goals: [
    'Legal should enable business',
    'Proactive risk mitigation',
    'Fast contract turnaround',
  ],
  painPoints: [
    'Complex regulations',
    'Transformation legal complexity',
    'Vendor contract volume',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'contract management system',
    'legal research tools',
    'regulatory updates',
  ],
  extensions: {
    background: 'Banking lawyer, previous counsel at central bank',
    philosophy: '"Legal should enable business, not just protect it"',
    oversees:
      'Contracts, regulatory matters, litigation, intellectual property',
  },
})
export class MayaPatelPersona {}
