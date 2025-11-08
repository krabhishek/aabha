import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { DigitalCustomerStakeholder } from '../../stakeholders/human/DigitalCustomerStakeholder.js';

/**
 * Account Opening Form Interaction
 * Frontend form interaction where customer fills out account opening application
 */
@Interaction({
  name: 'Account Opening Form',
  description: 'Customer fills and submits account opening form through mobile app or web interface. This is the primary entry point for the instant account opening journey.',
  pattern: InteractionPattern.FormInteraction,
  layer: InteractionLayer.Frontend,
  inputs: [
    {
      name: 'personalInformation',
      type: 'object',
      required: true,
      description: 'Customer personal information including name, date of birth, address',
      validation: {
        format: 'json',
        constraints: ['All required fields must be provided', 'Date of birth must be valid']
      },
      sensitivity: 'confidential'
    },
    {
      name: 'contactDetails',
      type: 'object',
      required: true,
      description: 'Email and phone number for account communication',
      validation: {
        format: 'email',
        constraints: ['Valid email format', 'Valid phone number format']
      },
      sensitivity: 'confidential'
    },
    {
      name: 'accountPreferences',
      type: 'object',
      required: false,
      description: 'Account type preferences and initial deposit amount'
    }
  ],
  outputs: [
    {
      name: 'formSubmissionResult',
      type: 'object',
      required: true,
      description: 'Result of form submission including validation status',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'applicationId',
      type: 'string',
      required: true,
      description: 'Unique identifier for the submitted application',
      validation: {
        format: 'uuid',
        constraints: ['Valid UUID format']
      }
    }
  ],
  frontendConfig: {
    framework: 'react-native',
    formValidation: {
      validationRules: ['email-format', 'required-fields', 'phone-format', 'date-format'],
      validationTiming: 'on-blur',
      validationType: 'both'
    },
    accessibility: {
      ariaLabels: {
        submit: 'Submit account opening application',
        personalInfo: 'Personal information section',
        contactInfo: 'Contact details section'
      },
      keyboardNavigation: true,
      screenReaderSupport: true
    },
    responsive: {
      breakpoints: ['mobile', 'tablet'],
      adaptiveLayouts: true,
      mobileFirst: true
    },
    stateManagement: {
      approach: 'local',
      persistence: 'session-storage'
    }
  },
  participants: [
    {
      stakeholder: DigitalCustomerStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['frontend', 'form', 'account-opening', 'customer-facing', 'onboarding']
})
export class AccountOpeningFormInteraction {}

