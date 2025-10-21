/**
 * Retail Banking - Employee Stakeholders
 *
 * Front-office employees serving retail banking customers including
 * branch staff, relationship managers, and customer service representatives.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RetailBankingContext } from '../../contexts/retail-banking.context.js';
import {
  RobertChangPersona,
  MichaelSantosPersona
} from '../../personas/human/employees/front-office.persona.js';

// ============================================================================
// Branch Staff & Relationship Managers
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Branch Relationship Manager',
  persona: RobertChangPersona,
  context: RetailBankingContext,
  goals: [
    'Build long-term customer relationships',
    'Help customers achieve financial goals',
    'Balance digital adoption with personal service',
    'Increase customer satisfaction and retention'
  ],
  responsibilities: [
    'Manage portfolio of retail customers',
    'Provide financial advice and product recommendations',
    'Assist customers with complex transactions',
    'Train customers on digital banking',
    'Resolve customer complaints',
    'Achieve branch targets'
  ],
  permissions: [
    'access_customer_profiles',
    'view_customer_accounts',
    'initiate_product_sales',
    'override_certain_limits',
    'access_CRM_system',
    'provide_assisted_digital_training'
  ],
  influence: 'high',
  engagement: 'daily',
  description: 'Experienced relationship manager helping customers navigate both branch and digital services'
})
export class BranchRelationshipManagerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Branch Teller',
  persona: MichaelSantosPersona,
  context: RetailBankingContext,
  goals: [
    'Provide efficient counter service',
    'Educate customers on digital alternatives',
    'Maintain cash handling accuracy',
    'Deliver excellent customer experience'
  ],
  responsibilities: [
    'Process deposits and withdrawals',
    'Handle cash transactions',
    'Verify customer identity',
    'Promote digital banking enrollment',
    'Cross-sell banking products',
    'Maintain transaction accuracy'
  ],
  permissions: [
    'process_transactions',
    'access_customer_accounts',
    'handle_cash',
    'verify_identity',
    'enroll_digital_banking',
    'access_teller_system'
  ],
  influence: 'medium',
  engagement: 'daily',
  description: 'Front-line branch staff processing transactions and helping customers adopt digital channels'
})
export class BranchTellerStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Customer Service Representative',
  persona: MichaelSantosPersona,
  context: RetailBankingContext,
  goals: [
    'Resolve customer issues quickly',
    'Turn complaints into loyalty opportunities',
    'Reduce customer effort (CES)',
    'Achieve first-call resolution'
  ],
  responsibilities: [
    'Handle customer inquiries via phone/chat/email',
    'Troubleshoot account issues',
    'Process service requests',
    'Escalate complex cases',
    'Gather customer feedback',
    'Update customer records'
  ],
  permissions: [
    'access_customer_accounts',
    'view_transaction_history',
    'initiate_service_requests',
    'escalate_to_supervisor',
    'access_knowledge_base',
    'update_customer_contact_info'
  ],
  influence: 'medium',
  engagement: 'daily',
  description: 'Customer service rep handling inquiries and resolving issues across all channels'
})
export class CustomerServiceRepresentativeStakeholder {}
