/**
 * Fraud Investigation Journey - Behaviors
 *
 * Observable behaviors with witness methods for fraud investigation.
 */

import { Behavior, Witness, WitnessType } from '../../../../../../src/index.js';
import {
  ChiefRiskOfficer,
  ChiefInformationSecurityOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  FraudDetectionMonitorStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';

// ============================================================================
// Fraud Investigation Behaviors
// ============================================================================

@Behavior({
  name: 'Detect Fraud Using AI',
  participants: [FraudDetectionMonitorStakeholder, ChiefRiskOfficer],
  preconditions: ['Transaction data available', 'ML models trained'],
  postconditions: ['Fraud score calculated', 'Alert generated if needed']
})
export class DetectFraudUsingAIBehavior {
  @Witness({
    name: 'Legitimate transaction scores low risk',
    type: WitnessType.Integration,
    given: ['Valid transaction', 'Normal customer behavior', 'Trained ML models'],
    when: ['Fraud detection runs', 'No fraud indicators found'],
    then: ['Low fraud score assigned', 'Transaction allowed', 'No alert generated']
  })
  legitimateTransactionLowRisk() {
    // Proof: Integration test verifying normal transaction handling
  }

  @Witness({
    name: 'Suspicious transaction scores high risk',
    type: WitnessType.Integration,
    given: ['Unusual transaction', 'Fraud indicators present'],
    when: ['Fraud detection runs', 'Multiple fraud signals detected'],
    then: ['High fraud score assigned', 'Transaction flagged', 'Investigation triggered']
  })
  suspiciousTransactionHighRisk() {
    // Proof: Integration test verifying fraud detection
  }
}

@Behavior({
  name: 'Investigate Fraud Case',
  participants: [ChiefRiskOfficer, ChiefInformationSecurityOfficer],
  preconditions: ['Fraud alert triggered', 'Evidence available'],
  postconditions: ['Investigation complete', 'Action taken']
})
export class InvestigateFraudCaseBehavior {
  @Witness({
    name: 'False positive - dismiss alert',
    type: WitnessType.E2E,
    given: ['Fraud alert triggered', 'Evidence collected'],
    when: ['Investigation conducted', 'No fraud confirmed'],
    then: ['Alert dismissed', 'Transaction allowed', 'Customer not impacted']
  })
  falsePositiveDismissed() {
    // Proof: E2E test verifying false positive handling
  }

  @Witness({
    name: 'Confirmed fraud - block and report',
    type: WitnessType.E2E,
    given: ['Fraud alert triggered', 'Strong evidence of fraud'],
    when: ['Investigation conducted', 'Fraud confirmed'],
    then: ['Transaction blocked', 'Account frozen', 'Fraud report filed', 'Customer notified']
  })
  confirmedFraudBlocked() {
    // Proof: E2E test verifying fraud blocking workflow
  }
}

@Behavior({
  name: 'Take Fraud Prevention Action',
  participants: [ChiefRiskOfficer],
  preconditions: ['Investigation complete', 'Decision made'],
  postconditions: ['Action taken', 'Report filed']
})
export class TakeFraudPreventionActionBehavior {
  @Witness({
    name: 'Account frozen to prevent further fraud',
    type: WitnessType.Integration,
    given: ['Confirmed fraud', 'Multiple suspicious transactions'],
    when: ['Risk officer takes action'],
    then: ['Account frozen', 'Customer contacted', 'Fraud team notified']
  })
  accountFrozenForFraud() {
    // Proof: Integration test verifying account freezing
  }
}
