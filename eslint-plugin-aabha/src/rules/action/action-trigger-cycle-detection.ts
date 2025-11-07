/**
 * Action Trigger Cycle Detection Rule
 *
 * **Why this rule exists:**
 * In workflow orchestration and Aabha's context engineering framework, **trigger cycles create
 * infinite loops** that will hang your system. When Action A triggers Action B, which triggers
 * Action A again, you've created a cycle that will execute endlessly, consuming resources and
 * never completing.
 *
 * Cycle detection tells AI systems:
 * 1. **Termination guarantees** - Does this workflow eventually complete?
 * 2. **Control flow validity** - Is the trigger graph a proper DAG (Directed Acyclic Graph)?
 * 3. **Resource safety** - Will this consume bounded resources or loop infinitely?
 * 4. **Journey completeness** - Can users actually finish this workflow?
 *
 * When AI sees cyclic triggers, it recognizes this as fundamentally broken control flow. No amount
 * of sophisticated orchestration can fix a cycle - it must be eliminated. Cycles prevent AI from
 * generating terminating workflows, computing journey duration, or reasoning about workflow states.
 *
 * **What it checks:**
 * - Actions MUST NOT trigger themselves (self-referential cycles)
 * - Full cycle detection across multiple actions requires cross-file analysis (CI/CD pipelines)
 *
 * **Examples:**
 * ```typescript
 * // ❌ Error - Self-referential cycle (action triggers itself)
 * @Action({
 *   name: 'Process Items',
 *   triggers: [
 *     { action: ProcessItemsAction }  // Triggers itself!
 *   ]
 * })
 * class ProcessItemsAction {}
 *
 * // ❌ Error - Cycle across actions (requires cross-file detection)
 * // Action A → Action B → Action A
 * @Action({
 *   name: 'Validate Order',
 *   triggers: [{ action: CheckInventoryAction }]
 * })
 * class ValidateOrderAction {}
 *
 * @Action({
 *   name: 'Check Inventory',
 *   triggers: [{ action: ValidateOrderAction }]  // Cycle!
 * })
 * class CheckInventoryAction {}
 *
 * // ✅ Good - DAG (no cycles)
 * @Action({
 *   name: 'Create Order',
 *   triggers: [{ action: ReserveInventoryAction }]
 * })
 * class CreateOrderAction {}
 *
 * @Action({
 *   name: 'Reserve Inventory',
 *   triggers: [{ action: ChargePaymentAction }]
 * })
 * class ReserveInventoryAction {}
 *
 * // ✅ Good - Conditional branching (no cycles)
 * @Action({
 *   name: 'Risk Assessment',
 *   executionMode: 'conditional',
 *   triggers: [
 *     { action: HighRiskFlow, condition: 'riskScore > 70' },
 *     { action: LowRiskFlow, condition: 'riskScore <= 70' }
 *   ]
 * })
 * ```
 *
 * **Note:** This ESLint rule detects only self-referential cycles (action triggering itself).
 * Detecting cycles across multiple actions requires cross-file analysis and should be performed
 * in CI/CD pipelines using the full Aabha analyzer.
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'selfReferentialCycle';

export const actionTriggerCycleDetection = createRule<[], MessageIds>({
  name: 'action-trigger-cycle-detection',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Detects self-referential trigger cycles that would cause infinite loops. Full cross-action cycle detection requires CI/CD pipeline analysis.',
    },
    messages: {
      selfReferentialCycle:
        "Action '{{name}}' triggers itself (class: {{className}}). This creates a self-referential cycle that will loop infinitely! When this action completes, it triggers itself again, which triggers itself again, forever. AI systems can't generate terminating workflows with cycles - the workflow has no stopping condition. This is fundamentally broken control flow. Remove the self-trigger or add conditional logic to break the cycle. For iterative processing, use explicit loop constructs or batch-processing patterns instead of recursive triggers.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        const className = node.id?.name;
        if (!className) return;

        for (const decorator of decorators) {
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const triggers = decorator.metadata.triggers as Array<{
            action?: { name?: string } | string;
            condition?: string;
          }> | undefined;

          if (!triggers || triggers.length === 0) continue;

          // Check for self-referential triggers
          for (const trigger of triggers) {
            let triggeredClassName: string | undefined;

            if (typeof trigger.action === 'string') {
              triggeredClassName = trigger.action;
            } else if (trigger.action && typeof trigger.action === 'object') {
              triggeredClassName = trigger.action.name;
            }

            // Check if the triggered action is the same as the current class
            if (triggeredClassName === className) {
              context.report({
                node: decorator.node,
                messageId: 'selfReferentialCycle',
                data: {
                  name: name || 'Unknown',
                  className,
                },
              });
              break; // Only report once per action
            }
          }
        }
      },
    };
  },
});
