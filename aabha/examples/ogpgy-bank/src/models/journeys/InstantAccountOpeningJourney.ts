import { Journey } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { StartAccountApplicationAction } from '../actions/StartAccountApplicationAction.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * Instant Account Opening Journey
 * Complete journey for a customer to open an account digitally in under 5 minutes
 */
@Journey({
  name: 'Instant Account Opening',
  description: 'End-to-end journey for customers to open a new account digitally in under 5 minutes',
  primaryStakeholder: DigitalCustomerStakeholder,
  entryActions: [
    StartAccountApplicationAction
  ],
  outcomes: [
    'Account opened successfully',
    'Account activated and ready to use',
    'Customer receives account details',
    'Customer can immediately start banking'
  ],
  metrics: [
    AccountOpeningTime
  ]
})
export class InstantAccountOpeningJourney {}


