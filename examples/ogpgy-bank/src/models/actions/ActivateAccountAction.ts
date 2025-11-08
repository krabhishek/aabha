import { Action, ActionScope, StepCriticality, StepDuration, StepAutomationLevel, StepExecutionMode } from 'aabha';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';
import { AccountActivationExpectation } from '../expectations/AccountActivationExpectation.js';
import { SubmitApplicationAction } from './SubmitApplicationAction.js';
import { DeactivateAccountAction } from './DeactivateAccountAction.js';

/**
 * Activate Account Action
 * System activates the newly created account and makes it available for use
 */
@Action({
  name: 'Activate Account',
  description: 'System activates the approved account and enables full banking functionality',
  actor: AccountSystemStakeholder,
  scope: ActionScope.System,
  criticality: StepCriticality.Required,
  estimatedDuration: StepDuration.Instant,
  automationLevel: StepAutomationLevel.FullyAutomated,
  executionMode: StepExecutionMode.Conditional,
  triggers: [
    {
      condition: 'applicationStatus === "approved" && kycCheckPassed === true && complianceCheckPassed === true',
      action: SubmitApplicationAction
    }
  ],
  expectations: [
    AccountActivationExpectation
  ],
  emitsEvent: 'account.activated',
  compensatingAction: DeactivateAccountAction,
  timeoutDuration: 'PT2M',
  maxRetries: 3,
  tags: [
    'system',
    'account-management',
    'critical-path',
    'automation'
  ]
})
export class ActivateAccountAction {}


