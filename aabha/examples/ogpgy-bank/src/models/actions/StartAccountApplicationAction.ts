import { Action, ActionScope, StepCriticality, StepDuration, StepAutomationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { VerifyIdentityExpectation } from '../expectations/VerifyIdentityExpectation.js';
import { CancelApplicationAction } from './CancelApplicationAction.js';

/**
 * Start Account Application Action
 * Customer initiates the account opening process
 */
@Action({
  name: 'Start Account Application',
  description: 'Customer begins the digital account opening process by accessing the application form',
  actor: DigitalCustomerStakeholder,
  scope: ActionScope.Journey,
  criticality: StepCriticality.Required,
  estimatedDuration: StepDuration.Quick,
  automationLevel: StepAutomationLevel.SemiAutomated,
  expectations: [
    VerifyIdentityExpectation
  ],
  emitsEvent: 'account.application.started',
  compensatingAction: CancelApplicationAction,
  timeoutDuration: 'PT2M',
  maxRetries: 2,
  tags: [
    'customer-facing',
    'onboarding',
    'critical-path',
    'account-opening'
  ]
})
export class StartAccountApplicationAction {}


