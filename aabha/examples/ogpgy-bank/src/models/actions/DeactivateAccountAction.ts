import { Action, ActionScope, StepCriticality, StepDuration, StepAutomationLevel } from 'aabha';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';
import { ActivateAccountAction } from './ActivateAccountAction.js';

/**
 * Deactivate Account Action
 * Compensating action to rollback account activation
 */
@Action({
  name: 'Deactivate Account',
  description: 'Compensating action to deactivate an account if downstream actions fail after activation',
  actor: AccountSystemStakeholder,
  scope: ActionScope.System,
  criticality: StepCriticality.Required,
  estimatedDuration: StepDuration.Instant,
  automationLevel: StepAutomationLevel.FullyAutomated,
  emitsEvent: 'account.deactivated',
  compensatingAction: ActivateAccountAction,  // If deactivation fails, reactivate
  timeoutDuration: 'PT2M',
  maxRetries: 2,
  tags: [
    'compensation',
    'system',
    'account-management',
    'error-handling',
    'rollback'
  ]
})
export class DeactivateAccountAction {}

