/**
 * Action Fallback Exists Rule
 *
 * **Why this rule exists:**
 * In distributed systems and Aabha's context engineering framework, **failure is inevitable**.
 * Critical actions that lack fallback strategies create brittle systems that break under real-world
 * conditions. Fallback strategies tell AI systems (and developers) how to maintain service quality
 * when primary paths fail.
 *
 * Well-engineered fallback context helps AI understand:
 * 1. **Resilience patterns** - How does the system degrade gracefully?
 * 2. **Error recovery** - What's the alternative path when this fails?
 * 3. **Business continuity** - Can we complete the journey despite this failure?
 * 4. **Saga patterns** - How do we undo this action if needed (compensation)?
 *
 * When critical actions lack fallbacks, AI can't generate resilient implementations. Without
 * compensation logic for state-changing actions, AI can't implement proper saga patterns or
 * rollback capabilities. This creates brittle systems that fail catastrophically.
 *
 * **What it checks:**
 * - Critical actions SHOULD have fallback strategies (fallbackAction or maxRetries)
 * - State-changing actions SHOULD have compensating actions for saga pattern support
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Critical action with fallback
 * @Action({
 *   name: 'Verify Identity via API',
 *   criticality: 'critical',
 *   fallbackAction: ManualIdentityVerification  // Fallback to human review
 * })
 *
 * // ✅ Good - Critical action with retry strategy
 * @Action({
 *   name: 'Charge Credit Card',
 *   criticality: 'critical',
 *   maxRetries: 3,
 *   retryBackoff: 'exponential'
 * })
 *
 * // ✅ Good - State-changing action with compensation
 * @Action({
 *   name: 'Reserve Inventory',
 *   emitsEvent: 'inventory.reserved',
 *   compensatingAction: ReleaseInventoryReservation  // For rollback
 * })
 *
 * // ⚠️ Warning - Critical without fallback
 * @Action({
 *   name: 'Process Payment',
 *   criticality: 'critical'
 *   // No fallbackAction, no maxRetries - what happens on failure?
 * })
 *
 * // ℹ️ Info - State change without compensation
 * @Action({
 *   name: 'Create Order',
 *   emitsEvent: 'order.created'
 *   // No compensatingAction - can't rollback in saga pattern
 * })
 * ```
 *
 * **Note:** This rule focuses on fallback strategy presence. Validating that referenced
 * fallback/compensating actions actually exist requires cross-file analysis and should be
 * performed in CI/CD pipelines.
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalNoFallback' | 'stateChangeNoCompensation';

export const actionFallbackExists = createRule<[], MessageIds>({
  name: 'action-fallback-exists',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Critical actions should have fallback strategies for resilience. State-changing actions should have compensating actions for saga pattern support.',
    },
    messages: {
      criticalNoFallback:
        "Action '{{name}}' is marked 'critical' but has no fallback strategy. Critical actions are business-essential operations that MUST complete - they need resilience mechanisms to handle failures gracefully. Without fallbacks (fallbackAction) or retries (maxRetries), this action creates a single point of failure. When this breaks, AI can't generate alternative flows, manual processes, or degraded service modes. Add either 'fallbackAction' (human intervention, alternative service) or 'maxRetries' (automatic retry with backoff) to engineer resilience into your system.",
      stateChangeNoCompensation:
        "Action '{{name}}' changes system state (scope: {{scope}}, emitsEvent: {{hasEvent}}) but has no compensatingAction. State-changing actions in distributed systems need compensation logic for saga pattern implementation and rollback capability. Without compensation, AI can't generate proper distributed transaction handling or error recovery flows. When downstream actions fail, how do we undo this state change? Add 'compensatingAction' to enable AI-assisted saga pattern implementation and maintain system consistency.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const criticality = decorator.metadata.criticality as string | undefined;
          const fallbackAction = decorator.metadata.fallbackAction;
          const compensatingAction = decorator.metadata.compensatingAction;
          const maxRetries = decorator.metadata.maxRetries as number | undefined;
          const scope = decorator.metadata.scope as string | undefined;
          const emitsEvent = decorator.metadata.emitsEvent as string | undefined;

          // Recommend fallback for critical actions
          if (criticality === 'critical' && !fallbackAction && !maxRetries) {
            context.report({
              node: decorator.node,
              messageId: 'criticalNoFallback',
              data: {
                name: name || 'Unknown',
              },
            });
          }

          // Recommend compensation for state-changing actions
          const isStateChanging = emitsEvent || scope === 'Journey' || scope === 'System';
          if (isStateChanging && !compensatingAction && criticality !== 'optional') {
            context.report({
              node: decorator.node,
              messageId: 'stateChangeNoCompensation',
              data: {
                name: name || 'Unknown',
                scope: scope || 'unknown',
                hasEvent: emitsEvent ? 'yes' : 'no',
              },
            });
          }
        }
      },
    };
  },
});
