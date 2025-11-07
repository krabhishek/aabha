/**
 * Action Compensation Pattern Rule
 *
 * **Why this rule exists:**
 * In distributed systems and Aabha's context engineering framework, **state changes are
 * irreversible without compensation logic**. When downstream actions in a workflow fail, the
 * system needs a way to undo previous state changes to maintain consistency. This is the
 * foundation of the Saga pattern - a critical distributed transaction pattern.
 *
 * Compensation actions tell AI systems:
 * 1. **Rollback strategy** - How to undo this state change if needed?
 * 2. **Saga pattern support** - Enable distributed transaction orchestration
 * 3. **Error recovery** - What happens when downstream actions fail?
 * 4. **System consistency** - How do we maintain invariants across failures?
 *
 * When state-changing actions lack compensation, AI can't generate proper saga implementations,
 * rollback logic, or distributed error handling. This creates systems that can't recover from
 * partial failures, leading to data inconsistency and manual intervention.
 *
 * **What it checks:**
 * - Actions that emit events SHOULD have compensatingAction
 * - Actions with Journey/System scope SHOULD have compensatingAction
 * - Actions with state-changing names (create, reserve, charge) SHOULD have compensatingAction
 * - Optional actions don't require compensation (not critical enough)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - State change with compensation
 * @Action({
 *   name: 'Reserve Inventory',
 *   emitsEvent: 'inventory.reserved',
 *   compensatingAction: ReleaseInventoryReservation
 * })
 * class ReserveInventoryAction {}
 *
 * // ✅ Good - Compensating action (reverses state change)
 * @Action({
 *   name: 'Release Inventory Reservation',
 *   emitsEvent: 'inventory.released',
 *   description: 'Undoes inventory reservation when order fails'
 * })
 * class ReleaseInventoryReservationAction {}
 *
 * // ✅ Good - Non-state-changing action (no compensation needed)
 * @Action({
 *   name: 'Calculate Shipping Cost',
 *   scope: ActionScope.Atomic
 *   // Pure calculation, no state change, no compensation needed
 * })
 *
 * // ℹ️ Info - State change without compensation
 * @Action({
 *   name: 'Create Order',
 *   scope: ActionScope.Journey,
 *   emitsEvent: 'order.created'
 *   // Missing compensatingAction - how to undo if payment fails?
 * })
 *
 * // ℹ️ Info - Name suggests state change
 * @Action({
 *   name: 'Charge Credit Card',
 *   // Missing compensatingAction - how to refund if fulfillment fails?
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

/**
 * Verbs in action names that suggest state changes
 */
const STATE_CHANGE_VERBS = new Set([
  'create',
  'update',
  'delete',
  'remove',
  'add',
  'register',
  'save',
  'persist',
  'reserve',
  'allocate',
  'charge',
  'debit',
  'credit',
  'transfer',
  'issue',
  'cancel',
  'modify',
]);

/**
 * Check if an action name suggests state change
 */
function namesSuggestsStateChange(name: string | undefined): boolean {
  if (!name) return false;
  const lowerName = name.toLowerCase();
  return Array.from(STATE_CHANGE_VERBS).some((verb) => lowerName.includes(verb));
}

type MessageIds = 'stateChangeNoCompensation';

export const actionCompensationPattern = createRule<[], MessageIds>({
  name: 'action-compensation-pattern',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'State-changing actions should have compensating actions to support saga patterns and enable rollback in distributed workflows',
    },
    messages: {
      stateChangeNoCompensation:
        "Action '{{name}}' appears to change system state ({{reasons}}) but has no compensatingAction. In distributed systems, state changes need compensation logic for saga pattern implementation and error recovery. When downstream actions fail, how do you undo this state change? Without compensation, AI can't generate proper distributed transaction handling or rollback flows. Add 'compensatingAction' to enable saga patterns and maintain system consistency across failures. Example: if this reserves inventory, add a compensating action that releases it.",
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
          const scope = decorator.metadata.scope as string | undefined;
          const emitsEvent = decorator.metadata.emitsEvent as string | undefined;
          const compensatingAction = decorator.metadata.compensatingAction;
          const criticality = decorator.metadata.criticality as string | undefined;

          // Skip if already has compensation or is optional
          if (compensatingAction || criticality === 'optional') {
            continue;
          }

          // Collect reasons why this is considered state-changing
          const reasons: string[] = [];

          if (emitsEvent) {
            reasons.push(`emits event: ${emitsEvent}`);
          }

          if (scope === 'Journey' || scope === 'System') {
            reasons.push(`has ${scope} scope`);
          }

          if (namesSuggestsStateChange(name)) {
            const matchedVerb = Array.from(STATE_CHANGE_VERBS).find((verb) =>
              name?.toLowerCase().includes(verb)
            );
            if (matchedVerb) {
              reasons.push(`name suggests "${matchedVerb}" operation`);
            }
          }

          // If any state-change indicators found, suggest compensation
          if (reasons.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'stateChangeNoCompensation',
              data: {
                name: name || 'Unknown',
                reasons: reasons.join(', '),
              },
            });
          }
        }
      },
    };
  },
});
