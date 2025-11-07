/**
 * Journey Entry Actions Exist Rule
 *
 * **Why this rule exists:**
 * Every journey needs explicit entry points - Actions that initiate the journey flow. Without
 * entry actions, it's unclear how the journey begins, making it impossible to trigger the flow,
 * generate user interfaces, or create automated orchestration.
 *
 * Missing entry actions cause:
 * - **Execution ambiguity** - Unclear how to start the journey
 * - **UI generation failures** - Cannot create entry screens or buttons
 * - **Orchestration gaps** - Automation systems don't know the starting point
 * - **Documentation confusion** - Team unsure how users enter the flow
 *
 * Clear entry actions enable:
 * 1. **Explicit flow initiation** - Define exactly where the journey starts
 * 2. **UI scaffolding** - Generate entry points in user interfaces
 * 3. **Process automation** - Systems know which Action to trigger first
 * 4. **Clear documentation** - Teams understand journey entry conditions
 *
 * **What it checks:**
 * - Journey has entryActions array with at least one Action
 * - Entry actions are defined to mark journey starting points
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Journey with clear entry action
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [
 *     EnterEmailPasswordAction,
 *     VerifyEmailAction,
 *     CreateAccountAction
 *   ],
 *   entryActions: [EnterEmailPasswordAction]  // Clear entry point
 * })
 *
 * // ❌ Bad - Journey without entry actions
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [
 *     EnterEmailPasswordAction,
 *     VerifyEmailAction,
 *     CreateAccountAction
 *   ]
 *   // Missing entryActions - how does this journey start?
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingEntryActions';

export const journeyEntryActionsExist = createRule<[], MessageIds>({
  name: 'journey-entry-actions-exist',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Journeys must have entryActions to define starting points. In context engineering, entry actions specify how the journey begins, enabling UI generation and process orchestration.',
    },
    messages: {
      missingEntryActions:
        "Journey '{{journeyName}}' has no entryActions defined. In context engineering, every journey needs explicit entry points to define how the flow starts. Add entryActions array with at least one Action that initiates this journey. Example: entryActions: [StartAccountOpeningAction]. Without entry actions, systems cannot generate entry UI or trigger the journey flow.",
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
          if (decorator.type !== 'Journey') continue;

          const journeyName = decorator.metadata.name as string | undefined;
          const entryActions = decorator.metadata.entryActions as unknown[] | undefined;

          // Check for missing or empty entryActions
          if (!entryActions || entryActions.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingEntryActions',
              data: {
                journeyName: journeyName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
