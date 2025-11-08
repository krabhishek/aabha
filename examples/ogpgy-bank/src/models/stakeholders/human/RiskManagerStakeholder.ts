import { Stakeholder, StakeholderType } from 'aabha';
import { RiskManagementContext } from '../../contexts/RiskManagementContext.js';
import { RiskManagerPersona } from '../../personas/human/RiskManagerPersona.js';

/**
 * Risk Manager Stakeholder
 * Human stakeholder responsible for assessing and managing banking risks
 */
@Stakeholder({
  name: 'Risk Manager',
  description: 'Risk management professional responsible for assessing credit risk, operational risk, and other banking risks. This stakeholder evaluates loan applications and other credit decisions.',
  type: StakeholderType.Human,
  role: 'Risk Manager',
  persona: RiskManagerPersona,
  context: RiskManagementContext,
  responsibilities: [
    'Assess credit risk for loan applications',
    'Evaluate operational risks',
    'Review risk models and policies',
    'Provide risk recommendations',
    'Participate in risk committees',
    'Monitor portfolio risk metrics'
  ],
  goals: [
    'Accurately assess and mitigate risks',
    'Support business growth while managing risk',
    'Maintain regulatory compliance',
    'Protect bank from losses',
    'Provide clear risk recommendations'
  ],
  painPoints: [
    'Complex risk assessment models',
    'Pressure to approve applications while managing risk',
    'Insufficient data for accurate risk assessment',
    'Balancing risk with business objectives',
    'Keeping up with regulatory changes'
  ],
  strategicImportance: 'critical',
  businessValue: 'Protects the bank from credit losses and operational risks, enabling responsible business growth while maintaining financial stability and regulatory compliance.',
  engagement: 'daily',
  accountability: [
    'Accurate risk assessments',
    'Timely risk decisions',
    'Regulatory compliance',
    'Risk documentation',
    'Portfolio risk monitoring'
  ],
  touchpoints: [
    'Risk management system - Daily risk assessments',
    'Email - Documentation and communication',
    'Phone - Urgent escalations',
    'In-person - Risk committee meetings'
  ],
  communicationPreferences: {
    preferredChannels: ['risk-system', 'email', 'phone'],
    responseTime: 'within 4 hours',
    availability: 'Business hours'
  },
  successCriteria: [
    'Accurate risk assessments',
    'Low default rates',
    'Regulatory compliance',
    'Effective risk mitigation',
    'Timely risk decisions'
  ],
  influence: 'high',
  influenceSphere: [
    'Loan approval decisions',
    'Credit risk policies',
    'Portfolio risk management',
    'Risk mitigation strategies'
  ],
  decisionAuthority: [
    'Risk assessment recommendations',
    'Credit risk evaluation',
    'Risk policy application',
    'Escalation to risk committee'
  ],
  risks: [
    {
      risk: 'Inaccurate risk assessment may lead to losses',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Comprehensive risk models, training, and peer review'
    },
    {
      risk: 'High workload may affect risk assessment quality',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Adequate staffing, efficient tools, and workload management'
    }
  ],
  kpis: [
    'Risk assessment accuracy > 95%',
    'Default rate < 2%',
    'Risk decisions within SLA > 90%',
    'Zero major risk incidents'
  ],
  satisfactionIndicators: [
    'Completes risk assessments accurately',
    'Receives positive feedback from management',
    'Has access to effective risk tools',
    'Feels confident in risk decisions',
    'Participates in risk committees',
    'Effectively mitigates risks'
  ],
  tags: ['risk-management', 'human', 'credit-risk', 'regulatory', 'critical-path']
})
export class RiskManagerStakeholder {}

