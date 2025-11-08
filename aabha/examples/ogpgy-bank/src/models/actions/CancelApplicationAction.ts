import { Action, ActionScope, StepCriticality, StepDuration, StepAutomationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { StartAccountApplicationAction } from './StartAccountApplicationAction.js';

/**
 * Cancel Application Action
 * Compensating action to cancel/abandon an account application
 */
@Action({
  name: 'Cancel Application',
  description: 'Compensating action to cancel an account application if downstream actions fail',
  actor: DigitalCustomerStakeholder,
  scope: ActionScope.Journey,
  criticality: StepCriticality.Required,
  estimatedDuration: StepDuration.Instant,
  automationLevel: StepAutomationLevel.SemiAutomated,
  emitsEvent: 'account.application.cancelled',
  compensatingAction: StartAccountApplicationAction,  // If cancellation fails, restart application
  timeoutDuration: 'PT2M',
  maxRetries: 2,
  tags: [
    'compensation',
    'account-management',
    'error-handling',
    'rollback'
  ]
})
export class CancelApplicationAction {}

