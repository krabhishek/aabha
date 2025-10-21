/**
 * Regulatory Organization Personas
 *
 * External regulatory bodies, central banks, and government authorities
 * that oversee banking operations and compliance.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'Genai Central Bank',
  technicalProficiency: 'medium',
  occupation: 'National Central Bank & Banking Regulator',
  description: 'Genai\'s central banking authority responsible for monetary policy, banking supervision, and financial system stability',
  preferredChannels: ['Regulatory portals', 'secure messaging', 'official correspondence', 'regulatory APIs'],
  goals: [
    'Maintain financial system stability',
    'Protect depositor interests',
    'Ensure banking sector compliance with regulations',
    'Promote financial inclusion and innovation'
  ],
  painPoints: [
    'Manual regulatory reporting from banks',
    'Delayed incident notifications',
    'Fragmented compliance data',
    'Difficulty monitoring real-time risks across banking sector'
  ],
  extensions: {
    type: 'Government Regulatory Authority',
    authority: 'Genai Banking Act 2020',
    jurisdiction: 'All licensed banks in Genai (12 commercial banks)',
    responsibilities: [
      'Banking license issuance and supervision',
      'Capital adequacy monitoring',
      'AML/CFT compliance oversight',
      'Consumer protection enforcement',
      'Crisis management and bank resolution'
    ],
    regulatoryRequirements: {
      reporting: 'Monthly regulatory returns, Quarterly prudential reports',
      incidents: 'Critical incidents within 2 hours, Material incidents within 24 hours',
      audits: 'Annual on-site examinations',
      capitalAdequacy: 'Minimum 12% CAR (Capital Adequacy Ratio)'
    },
    digitalInitiatives: [
      'Real-time regulatory reporting platform (2024)',
      'Open Banking framework',
      'Digital currency (CBDC) pilot',
      'RegTech sandbox for innovation'
    ],
    contactPoints: {
      supervision: 'Banking Supervision Department',
      compliance: 'Compliance & AML Division',
      technology: 'FinTech & Innovation Unit',
      crisis: '24/7 Crisis Management Hotline'
    }
  }
})
export class GenaiCentralBankPersona {}

@Persona({
  name: 'Genai Financial Intelligence Unit',
  technicalProficiency: 'high',
  occupation: 'AML/CFT Enforcement & Financial Intelligence Agency',
  description: 'Government agency responsible for receiving, analyzing, and disseminating financial intelligence to combat money laundering and terrorism financing',
  preferredChannels: ['Secure STR portal', 'encrypted messaging', 'intelligence databases'],
  goals: [
    'Detect and prevent money laundering',
    'Combat terrorism financing',
    'Identify financial crime networks',
    'Support law enforcement investigations'
  ],
  painPoints: [
    'Volume of Suspicious Transaction Reports (STRs)',
    'False positives in bank reporting',
    'Delayed reporting from financial institutions',
    'Cross-border intelligence sharing challenges'
  ],
  extensions: {
    type: 'Government Law Enforcement Agency',
    authority: 'Genai AML/CFT Act 2019',
    reporting: {
      strVolume: '150,000 STRs/year from all financial institutions',
      timeline: 'Banks must report within 24 hours of suspicion',
      format: 'GoAML XML standard',
      feedback: 'Quarterly feedback to banks on STR quality'
    },
    analysisTools: [
      'Network analysis for money laundering chains',
      'Pattern recognition AI',
      'Cross-border transaction tracking',
      'Sanctions screening and PEP monitoring'
    ],
    enforcement: {
      penalties: 'Up to GD$10 million for serious AML breaches',
      criminalReferrals: 'To Attorney General for prosecution',
      bankingSuspension: 'Can suspend banking licenses for egregious violations'
    },
    internationalCooperation: 'FATF member, Egmont Group, bilateral MOUs with 45 countries'
  }
})
export class GenaiFinancialIntelligenceUnitPersona {}
