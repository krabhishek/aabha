/**
 * Compliance Workflow Journey - Behaviors
 *
 * Observable behaviors with witness methods for compliance screening.
 */

import { Behavior, Witness, WitnessType } from '../../../../../../src/index.js';
import {
  ChiefComplianceOfficerStakeholder,
  AMLComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  AMLTransactionMonitorStakeholder,
  SanctionsScreeningEngineStakeholder
} from '../../../stakeholders/risk-compliance/system-stakeholders.js';

// ============================================================================
// Compliance Behaviors
// ============================================================================

@Behavior({
  name: 'Perform Real-Time AML Screening',
  participants: [AMLTransactionMonitorStakeholder, AMLComplianceOfficerStakeholder],
  preconditions: ['Transaction initiated', 'AML system operational'],
  postconditions: ['Transaction screened', 'Risk score generated']
})
export class PerformRealTimeAMLScreeningBehavior {
  @Witness({
    name: 'Low-risk transaction auto-approved',
    type: WitnessType.Integration,
    given: ['Valid transaction', 'Low-risk customer', 'AML system operational'],
    when: ['Transaction is screened', 'Risk score < threshold'],
    then: ['Transaction auto-approved', 'No manual review required', 'Audit log created']
  })
  lowRiskAutoApproved() {
    // Proof: Integration test verifying auto-approval flow
  }

  @Witness({
    name: 'High-risk transaction flagged for review',
    type: WitnessType.Integration,
    given: ['Transaction with risk indicators', 'High-risk customer profile'],
    when: ['AML screening detects risk', 'Risk score > threshold'],
    then: ['Transaction flagged', 'Manual review triggered', 'Compliance team notified']
  })
  highRiskFlaggedForReview() {
    // Proof: Integration test verifying escalation flow
  }
}

@Behavior({
  name: 'Verify Against Sanctions Lists',
  participants: [SanctionsScreeningEngineStakeholder, ChiefComplianceOfficerStakeholder],
  preconditions: ['Customer data available', 'Sanctions lists updated'],
  postconditions: ['Sanctions check complete', 'Match results documented']
})
export class VerifyAgainstSanctionsListsBehavior {
  @Witness({
    name: 'No sanctions match - transaction proceeds',
    type: WitnessType.Integration,
    given: ['Valid customer', 'Updated sanctions lists'],
    when: ['Sanctions screening performed', 'No matches found'],
    then: ['Transaction cleared', 'Screening logged', 'Transaction can proceed']
  })
  noSanctionsMatch() {
    // Proof: Integration test verifying clean screening
  }

  @Witness({
    name: 'Sanctions match detected - transaction blocked',
    type: WitnessType.Integration,
    given: ['Customer on sanctions list', 'Updated sanctions lists'],
    when: ['Sanctions screening performed', 'Match detected'],
    then: ['Transaction blocked', 'Compliance team alerted', 'Report filed']
  })
  sanctionsMatchDetected() {
    // Proof: Integration test verifying blocking flow
  }
}

@Behavior({
  name: 'Conduct Manual Compliance Review',
  participants: [ChiefComplianceOfficerStakeholder, AMLComplianceOfficerStakeholder],
  preconditions: ['Transaction flagged', 'Compliance officer available'],
  postconditions: ['Review complete', 'Decision made']
})
export class ConductManualComplianceReviewBehavior {
  @Witness({
    name: 'Manual review approves transaction',
    type: WitnessType.E2E,
    given: ['Flagged transaction', 'Compliance officer assigned'],
    when: ['Manual review conducted', 'Risk deemed acceptable'],
    then: ['Transaction approved', 'Review documented', 'Customer notified']
  })
  manualReviewApproves() {
    // Proof: E2E test verifying manual approval workflow
  }
}
