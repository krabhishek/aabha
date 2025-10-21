/**
 * Technology Context
 *
 * Back-office context for technology platform, engineering,
 * cybersecurity, data, and digital product development.
 *
 * Owners: Raj Patel (CTO), Amara Williams (CISO), David Kim (CDO), Lisa Wong (Chief Digital)
 */

import { Context, ContextRelationship } from '../../../../src/index.js';
import { RetailBankingContext } from './retail-banking.context.js';
import { SMEBankingContext } from './sme-banking.context.js';
import { WealthManagementContext } from './wealth-management.context.js';
import { RiskComplianceContext } from './risk-compliance.context.js';
import { OperationsContext } from './operations.context.js';

@Context({
  name: 'Technology',
  goals: [
    'Technology should empower humans, not replace empathy',
    'Build modern, scalable, secure cloud-native platform',
    'Complete core banking migration (60% → 100%)',
    'Zero-trust security architecture',
    'Data as strategic asset for personalization'
  ],
  responsibilities: [
    'Core banking system (migrating COBOL → cloud-native microservices)',
    'Mobile and web banking applications',
    'Cybersecurity and information security',
    'Data platform and AI/ML infrastructure',
    'API platform for open banking',
    'Cloud infrastructure and DevOps',
    'Engineering team management (450 engineers, was 120)',
    'Technology vendor relationships'
  ],
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Provides core banking and mobile app services',
      exchanged: ['APIs', 'account services', 'transaction processing', 'mobile app']
    },
    {
      context: SMEBankingContext,
      type: ContextRelationship.Upstream,
      description: 'Provides business banking platform and payment APIs',
      exchanged: ['business APIs', 'payment gateway', 'merchant services platform']
    },
    {
      context: WealthManagementContext,
      type: ContextRelationship.Upstream,
      description: 'Provides wealth platform and AI advisory services',
      exchanged: ['portfolio management APIs', 'market data', 'AI recommendations']
    },
    {
      context: RiskComplianceContext,
      type: ContextRelationship.Upstream,
      description: 'Provides AI fraud detection and monitoring systems',
      exchanged: ['fraud detection APIs', 'real-time alerts', 'compliance dashboards']
    },
    {
      context: OperationsContext,
      type: ContextRelationship.Upstream,
      description: 'Provides core systems and automation tools',
      exchanged: ['payment processing APIs', 'automation workflows', 'system status']
    }
  ],
  extensions: {
    backstory: 'Led by Raj Patel (CTO, 41) - ex-Amazon engineer, led 2 startups. Team grew from 120 to 450 engineers in 18 months',
    tech_stack: 'Migrating from COBOL mainframes to cloud-native microservices',
    security: 'Amara Williams (CISO, 39) runs monthly "Hack OgPgyBank" competitions, zero-trust architecture',
    data: 'David Kim (CDO, 44) - ex-Google, PhD in ML. "Data is the new empathy—it tells us what customers need before they know it"',
    digital: 'Lisa Wong (Chief Digital, 37) - ex-neobank product lead. "Digital isn\'t a channel, it\'s a mindset"'
  }
})
export class TechnologyContext {}
