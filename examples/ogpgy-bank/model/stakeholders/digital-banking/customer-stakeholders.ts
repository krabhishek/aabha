/**
 * Digital Banking - Customer Stakeholders
 *
 * Customer stakeholders in the digital banking context, representing
 * users who interact with OgPgyBank's digital channels (mobile app, web).
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RetailBankingContext } from '../../contexts/retail-banking.context.js';
import {
  MarcusLeePersona,
  ZaraAhmedPersona
} from '../../personas/human/customers/young-adults.persona.js';
import {
  MariaSantosPersona
} from '../../personas/human/customers/families.persona.js';

// ============================================================================
// Digital-First Customers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital-First Customer',
  persona: MarcusLeePersona,
  context: RetailBankingContext,
  goals: [
    'Open account entirely on mobile without visiting branch',
    'Complete KYC verification in < 5 minutes',
    'Get instant virtual card for immediate use',
    'Seamless, intuitive digital experience'
  ],
  responsibilities: [
    'Provide accurate personal information',
    'Upload valid identity documents',
    'Complete biometric verification',
    'Review and accept terms & conditions'
  ],
  permissions: [
    'access_mobile_app',
    'initiate_account_opening',
    'upload_documents',
    'view_account_details',
    'use_virtual_card'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Tech-savvy young professional who expects banking to be as smooth as ordering food delivery'
})
export class DigitalFirstCustomerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Student Mobile User',
  persona: ZaraAhmedPersona,
  context: RetailBankingContext,
  goals: [
    'Zero-fee basic account',
    'Fast mobile account opening',
    'Learn financial management through app',
    'Access banking 24/7 from phone'
  ],
  responsibilities: [
    'Maintain minimum account balance (GD$0 for student accounts)',
    'Keep contact information updated',
    'Report lost/stolen cards immediately'
  ],
  permissions: [
    'access_mobile_app',
    'initiate_account_opening',
    'access_student_perks',
    'view_financial_literacy_content'
  ],
  influence: 'medium',
  engagement: 'daily',
  description: 'University student opening first bank account, entirely through mobile'
})
export class StudentMobileUserStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Family Digital Banking User',
  persona: MariaSantosPersona,
  context: RetailBankingContext,
  goals: [
    'Manage family finances digitally',
    'Set up savings goals for children',
    'Pay bills and transfer money quickly',
    'Track spending across family members'
  ],
  responsibilities: [
    'Manage joint account with spouse',
    'Set up authorized users (children)',
    'Monitor account activity',
    'Maintain transaction records'
  ],
  permissions: [
    'access_mobile_app',
    'access_web_banking',
    'manage_joint_account',
    'create_savings_goals',
    'setup_authorized_users'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Working mother managing family finances through digital channels'
})
export class FamilyDigitalBankingUserStakeholder {}
