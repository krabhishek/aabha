import { Journey } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { StartAccountApplicationAction } from '../actions/StartAccountApplicationAction.js';
import { SubmitApplicationAction } from '../actions/SubmitApplicationAction.js';
import { ActivateAccountAction } from '../actions/ActivateAccountAction.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * Instant Account Opening Journey
 * Complete journey for a customer to open an account digitally in under 5 minutes
 * 
 * This journey demonstrates how Actions, Expectations, Interactions, Behaviors, and Witnesses
 * work together to model a complete customer experience flow.
 */
@Journey({
  name: 'Instant Account Opening',
  description: 'End-to-end journey for customers to open a new account digitally in under 5 minutes',
  primaryStakeholder: DigitalCustomerStakeholder,
  entryActions: [
    StartAccountApplicationAction
  ],
  actions: [
    StartAccountApplicationAction,
    SubmitApplicationAction,
    ActivateAccountAction
  ],
  outcomes: [
    'Account opened successfully',
    'Account activated and ready to use',
    'Customer receives account details',
    'Customer can immediately start banking'
  ],
  metrics: [
    AccountOpeningTime
  ],
  tags: ['onboarding', 'account-opening', 'digital', 'customer-facing', 'critical-path', 'instant']
})
export class InstantAccountOpeningJourney {}


