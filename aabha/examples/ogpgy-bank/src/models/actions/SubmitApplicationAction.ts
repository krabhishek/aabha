import { Action, ActionScope, StepCriticality, StepDuration, StepAutomationLevel, StepExecutionMode } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { ProcessApplicationExpectation } from '../expectations/ProcessApplicationExpectation.js';
import { StartAccountApplicationAction } from './StartAccountApplicationAction.js';
import { CancelApplicationAction } from './CancelApplicationAction.js';

/**
 * Submit Application Action
 * Customer submits completed account application for processing
 */
@Action({
  name: 'Submit Application',
  description: 'Customer submits the completed account application form with all required information',
  actor: DigitalCustomerStakeholder,
  scope: ActionScope.Journey,
  criticality: StepCriticality.Required,
  estimatedDuration: StepDuration.Quick,
  automationLevel: StepAutomationLevel.SemiAutomated,
  executionMode: StepExecutionMode.Conditional,
  triggers: [
    {
      condition: 'applicationFormCompleted === true && identityVerified === true',
      action: StartAccountApplicationAction
    }
  ],
  expectations: [
    ProcessApplicationExpectation
  ],
  emitsEvent: 'account.application.submitted',
  compensatingAction: CancelApplicationAction,
  timeoutDuration: 'PT2M',
  maxRetries: 2,
  tags: [
    'customer-facing',
    'onboarding',
    'critical-path',
    'account-opening',
    'form-submission'
  ]
})
export class SubmitApplicationAction {}


