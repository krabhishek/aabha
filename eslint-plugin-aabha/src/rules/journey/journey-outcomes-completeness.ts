/**
 * Journey Outcomes Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **outcomes** define measurable business results of a journey.
 * When outcomes are provided, they should be meaningful and complete. Empty outcomes or outcomes with
 * only placeholder text lack the information needed to understand journey value.
 *
 * Outcomes completeness enables AI to:
 * 1. **Understand journey value** - Know what business results the journey delivers
 * 2. **Generate summaries** - Create meaningful journey descriptions
 * 3. **Link to strategy** - Connect journey outcomes to business goals
 * 4. **Enable validation** - Understand success criteria for the journey
 *
 * **What it checks:**
 * - If outcomes exist, they should not be empty strings
 * - Outcomes should be meaningful (not just placeholders)
 * - Outcomes should describe business results, not technical steps
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete and meaningful outcomes
 * @Journey({
 *   name: 'Instant Account Opening',
 *   outcomes: [
 *     'Account opened successfully',
 *     'Account activated and ready to use',
 *     'Customer receives account details',
 *     'Customer can immediately start banking'
 *   ]
 * })
 *
 * // ❌ Bad - Empty or placeholder outcomes
 * @Journey({
 *   name: 'Instant Account Opening',
 *   outcomes: [
 *     '',
 *     'TODO: Add outcome'
 *   ]
 * })
 *
 * // ❌ Bad - Technical steps instead of business outcomes
 * @Journey({
 *   name: 'Instant Account Opening',
 *   outcomes: [
 *     'API call completed',
 *     'Database record created'
 *   ]
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'emptyOutcome' | 'placeholderOutcome';

export const journeyOutcomesCompleteness = createRule<[], MessageIds>({
  name: 'journey-outcomes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journey outcomes should be complete and meaningful. Outcomes define business results, not technical steps.',
    },
    messages: {
      emptyOutcome:
        "Journey '{{name}}' has empty outcome at index {{index}}. Outcomes should describe measurable business results. Remove empty outcomes or add meaningful business outcome descriptions (e.g., 'Customer has verified account', 'Order is confirmed and payment processed').",
      placeholderOutcome:
        "Journey '{{name}}' has placeholder outcome '{{outcome}}' at index {{index}}. Outcomes should describe actual business results, not placeholders. Replace with meaningful outcome descriptions (e.g., 'Customer has verified account', 'Order is confirmed and payment processed').",
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

          const name = decorator.metadata.name as string | undefined;
          const outcomes = decorator.metadata.outcomes as string[] | undefined;

          // Only check if outcomes exist
          if (!outcomes || !Array.isArray(outcomes)) continue;

          for (let i = 0; i < outcomes.length; i++) {
            const outcome = outcomes[i];

            // Check for empty string
            if (typeof outcome === 'string' && outcome.trim().length === 0) {
              context.report({
                node: decorator.node,
                messageId: 'emptyOutcome',
                data: {
                  name: name || 'Unnamed journey',
                  index: i.toString(),
                },
              });
              continue;
            }

            // Check for placeholder text
            if (
              typeof outcome === 'string' &&
              (outcome.toLowerCase().includes('todo') ||
                outcome.toLowerCase().includes('placeholder') ||
                outcome.toLowerCase().includes('tbd') ||
                outcome.toLowerCase().includes('example'))
            ) {
              context.report({
                node: decorator.node,
                messageId: 'placeholderOutcome',
                data: {
                  name: name || 'Unnamed journey',
                  outcome,
                  index: i.toString(),
                },
              });
            }
          }
        }
      },
    };
  },
});

