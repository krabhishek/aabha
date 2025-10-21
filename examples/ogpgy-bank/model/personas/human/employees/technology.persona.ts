/**
 * Technology Leadership Personas
 *
 * CTO, CISO, CDO, Chief Digital Officer - driving the digital core transformation.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Raj Patel - Chief Technology Officer',
  age: '41',
  occupation: 'CTO of OgPgyBank Limited',
  goals: [
    'Build modern, scalable, secure cloud-native platform',
    'Complete core banking migration (60% → 100%)',
    'Grow engineering team from 120 to 600+',
    'Technology should empower humans, not replace empathy',
  ],
  painPoints: [
    'Legacy COBOL mainframes deeply embedded',
    'Talent shortage in Genai for cloud-native engineers',
    "40+ legacy systems that don't talk to each other",
    'Balancing speed with stability during migration',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'engineering dashboards',
    'code reviews',
    'architecture discussions',
    'team standups',
  ],
  extensions: {
    background: 'Led engineering at 2 successful startups, ex-Amazon engineer',
    tenure: '18 months',
    philosophy: '"Technology should empower humans, not replace empathy"',
    mission: 'Build a modern, scalable, secure technology platform',
    teamSize: '450 engineers (was 120 when he joined)',
    techStack: 'Migrating from COBOL mainframes to cloud-native microservices',
    quote:
      '"We\'re not just building a bank - we\'re building a technology company that happens to do banking"',
    keyInitiatives: [
      'Core banking migration',
      'Cloud infrastructure',
      'API platform',
      'DevOps culture',
    ],
    challengeDetail:
      'Recruited from Silicon Valley - bringing startup speed to banking',
  },
})
export class RajPatelPersona {}

@Persona({
  name: 'Amara Williams - Chief Information Security Officer',
  age: '39',
  occupation: 'CISO of OgPgyBank Limited',
  goals: [
    'Zero-trust security architecture',
    "Security is everyone's job, starting with me",
    'Proactive threat detection and response',
    'Build security-aware culture across 8,200 employees',
  ],
  painPoints: [
    'Legacy systems have security vulnerabilities',
    'Insider threats from disgruntled employees during transformation',
    'Sophisticated phishing attacks targeting customers',
    'Compliance with evolving cybersecurity regulations',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'security dashboards',
    'threat intelligence feeds',
    'incident response command center',
  ],
  extensions: {
    background:
      'Cybersecurity consultant, ethical hacker, MS in Computer Security',
    philosophy: '"Security is everyone\'s job, starting with me"',
    knownFor: 'Monthly "Hack OgPgyBank" internal competitions',
    focus:
      'Zero-trust architecture, customer data protection, security culture',
    quote:
      '"If you can hack us, you get a bonus. If hackers hack us, we all lose our jobs. So please, try to hack us."',
    innovation:
      'Gamified security training - employees earn points for reporting phishing',
    metrics: [
      'Zero successful breaches',
      'Time to detect threats',
      'Employee security awareness scores',
    ],
  },
})
export class AmaraWilliamsPersona {}

@Persona({
  name: 'David Kim - Chief Data Officer',
  age: '44',
  occupation: 'CDO of OgPgyBank Limited',
  goals: [
    'Data is the new empathy - tell us what customers need',
    'Real-time customer insights for personalization',
    'Build AI/ML platform for banking',
    "Make OgPgyBank's data a strategic asset",
  ],
  painPoints: [
    'Data scattered across 40+ legacy systems',
    'Data quality issues from decades of accumulation',
    'Privacy regulations (GDPR-equivalent) limit data usage',
    'Building AI models requires massive data engineering first',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'data dashboards',
    'ML model performance metrics',
    'customer insight sessions',
  ],
  extensions: {
    background: 'Data science leader at Google, PhD in Machine Learning',
    philosophy:
      '"Data is the new empathy—it tells us what customers need before they know it"',
    initiatives:
      'Real-time customer insights, AI/ML platforms, data governance',
    goal: "Make OgPgyBank's data a strategic asset",
    quote:
      '"Every transaction tells a story. Our job is to listen and help customers write happier endings."',
    ethicalAI: 'Strong advocate for responsible AI - no predatory algorithms',
    keyProjects: [
      'AI savings assistant',
      'Fraud detection ML',
      'Customer 360° view',
      'Predictive analytics',
    ],
  },
})
export class DavidKimPersona {}

@Persona({
  name: 'Lisa Wong - Chief Digital Officer',
  age: '37',
  occupation: 'Chief Digital Officer of OgPgyBank Limited',
  goals: [
    "Digital isn't a channel, it's a mindset",
    'Make mobile the primary banking channel',
    'Achieve 4.8+ app rating at scale (2M users)',
    'Drive 60% of transactions through digital',
  ],
  painPoints: [
    'Branch-centric culture resistant to digital-first',
    'Coordinating across product, engineering, design, marketing',
    'Competing with neobanks that are digital-native',
    'Balancing innovation speed with regulatory compliance',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'product analytics',
    'customer journey maps',
    'A/B test results',
    'app store reviews',
  ],
  extensions: {
    background:
      'Product lead at successful neobank, design thinking evangelist',
    philosophy: '"Digital isn\'t a channel, it\'s a mindset"',
    drives:
      'Mobile app, web banking, digital marketing, customer journey optimization',
    measurement: 'NPS, app ratings, digital adoption rates',
    quote:
      '"We\'re not digitizing a bank - we\'re building a digital bank that respects its heritage"',
    achievement: 'Launched mobile app V2 to 4.8 stars in 6 months',
    approach: 'Customer-obsessed, data-driven, design-led, agile delivery',
  },
})
export class LisaWongPersona {}
