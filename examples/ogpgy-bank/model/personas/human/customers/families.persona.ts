/**
 * Family Customer Personas
 *
 * Working families juggling multiple financial goals - mortgages, education savings,
 * daily expenses. Need simple tools to manage complex household finances.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Maria Santos - Working Mother',
  age: '35',
  occupation: 'Marketing Manager at local retail chain',
  goals: [
    "Save for children's education",
    'Manage household budget effectively',
    'Pay mortgage and bills on time',
    'Build emergency fund for family security',
  ],
  painPoints: [
    'Juggling multiple accounts and goals is overwhelming',
    'No consolidated view of family finances',
    'Bills and payments scattered across systems',
    'Limited time to visit branches or manage banking',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'mobile app',
    'web banking',
    'occasional branch for complex needs',
  ],
  extensions: {
    income: 'GD$68,000/year',
    householdIncome: 'GD$120,000/year (husband is teacher, GD$52,000)',
    family: 'Married, 2 children (ages 8 and 5)',
    bankingNeeds: [
      'Family savings',
      'Children education savings',
      'Mortgage',
      'Credit card',
      'Bill payment automation',
    ],
    behavior:
      'Mobile-first for daily banking, checks app multiple times per day',
    painPointDetail:
      "Struggles to track if she's on budget across multiple savings goals",
    quote:
      '"I need banking that understands I\'m managing a household, not just an account"',
    opportunity:
      'AI-powered savings goals and budget tracking can be life-changing',
    successMetrics: 'Customer effort score, savings goal achievement, NPS',
  },
})
export class MariaSantosPersona {}

@Persona({
  name: 'David & Emma Foster - Young Professional Couple',
  age: '32 (David) & 30 (Emma)',
  occupation: 'Software Engineer (David) & Graphic Designer (Emma)',
  goals: [
    'Save deposit for first home',
    'Manage joint finances effectively',
    'Build investment portfolio together',
    'Plan for future family',
  ],
  painPoints: [
    'Coordinating finances across two accounts is clumsy',
    "Traditional banks don't understand modern couples' needs",
    'Home loan process seems complex and slow',
    'Want financial planning tools, not just accounts',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['mobile app', 'web banking - never visit branches'],
  extensions: {
    combinedIncome: 'GD$125,000/year',
    lifeStage: 'Recently married, planning to buy first home',
    bankingNeeds: [
      'Joint account',
      'Home loan',
      'Investment account',
      'Savings goals for house deposit',
    ],
    behavior: 'Expect seamless digital experience, research everything online',
    motivation: 'Want to become homeowners within 2 years',
    quote:
      '"We should be able to apply for a home loan as easily as we booked our honeymoon"',
    opportunity: 'Home loan journey + wealth management as income grows',
    successMetrics:
      'Home loan conversion, joint account adoption, digital engagement',
  },
})
export class DavidEmmaFosterPersona {}
