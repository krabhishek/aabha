/**
 * Journey Outcomes Measurable Rule
 *
 * **Why this rule exists:**
 * Journeys must have clear, measurable business outcomes to validate their purpose and success.
 * Outcomes define what the journey achieves from a business perspective - the end state after
 * successful completion. Without defined outcomes, teams cannot assess if the journey delivers value.
 *
 * Missing outcomes cause:
 * - **Purpose ambiguity** - Unclear what the journey achieves
 * - **Success validation gaps** - Cannot determine if journey is effective
 * - **Business disconnect** - Journey not linked to business goals
 * - **Stakeholder confusion** - Unclear value proposition
 *
 * Clear outcomes enable:
 * 1. **Purpose clarity** - Everyone understands journey's business goal
 * 2. **Success validation** - Can verify journey achieves desired results
 * 3. **Business alignment** - Link journey to strategic objectives
 * 4. **Value communication** - Articulate journey benefits to stakeholders
 *
 * **What it checks:**
 * - Journey has outcomes array with at least one outcome
 * - Outcomes are measurable business results
 * - Outcomes define the end state after journey completion
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Journey with clear, measurable outcomes
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [EnterEmailPasswordAction, VerifyEmailAction],
 *   entryActions: [EnterEmailPasswordAction],
 *   metrics: [AccountOpeningCompletionRateMetric],
 *   outcomes: [
 *     'Customer has verified account',
 *     'Customer can access banking services',
 *     'Account is compliant with KYC regulations'
 *   ]
 * })
 *
 * // ❌ Bad - Journey without outcomes
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [EnterEmailPasswordAction, VerifyEmailAction],
 *   entryActions: [EnterEmailPasswordAction],
 *   metrics: [AccountOpeningCompletionRateMetric]
 *   // Missing outcomes - what does this journey achieve?
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingOutcomes';

export const journeyOutcomesMeasurable = createRule<[], MessageIds>({
  name: 'journey-outcomes-measurable',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journeys should have measurable business outcomes. In context engineering, outcomes define journey purpose and success criteria, linking flows to business goals.',
    },
    messages: {
      missingOutcomes:
        "Journey '{{journeyName}}' has no outcomes defined. In context engineering, every journey should have clear, measurable business outcomes that define what is achieved upon completion. Add outcomes array with business results. Examples: 'Customer has verified account', 'Order is confirmed and payment processed', 'User can access premium features'. Outcomes should describe the end state from a business perspective, not technical implementation. Without outcomes, teams cannot validate journey value or align to strategic goals.",
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
          const outcomes = decorator.metadata.outcomes as string[] | undefined;

          // Check for missing or empty outcomes
          if (!outcomes || outcomes.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingOutcomes',
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
