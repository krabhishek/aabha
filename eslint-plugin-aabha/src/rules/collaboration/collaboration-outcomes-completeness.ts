/**
 * Collaboration Outcomes Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **expectedOutcomes** define what should be achieved
 * or produced by a collaboration. When outcomes are provided, they should be complete with
 * outcome description to enable proper success measurement and tracking.
 *
 * Complete outcomes enable AI to:
 * 1. **Measure success** - Know when collaboration goals are achieved
 * 2. **Generate monitoring** - Create code to track expected outcomes
 * 3. **Report status** - Determine collaboration completion status
 * 4. **Enable validation** - Verify collaboration outcomes
 *
 * Incomplete outcomes make it harder to measure success or track collaboration completion.
 *
 * **What it checks:**
 * - Outcomes have `outcome` field when provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete outcomes
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   expectedOutcomes: [
 *     {
 *       outcome: 'Investment decisions made',
 *       type: 'decision',
 *       responsibleParty: InvestorStakeholder
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Incomplete outcome
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   expectedOutcomes: [
 *     {
 *       type: 'decision'
 *       // Missing outcome description
 *     }
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteOutcome';

export const collaborationOutcomesCompleteness = createRule<[], MessageIds>({
  name: 'collaboration-outcomes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaboration expected outcomes should be complete with outcome description when provided. Complete outcomes enable proper success measurement and tracking.',
    },
    messages: {
      incompleteOutcome:
        "Collaboration '{{name}}' has expectedOutcomes but outcome at index {{index}} is missing 'outcome' field. Complete outcomes should include an outcome description to enable proper success measurement. Add the missing outcome field to the outcome.",
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
          if (decorator.type !== 'Collaboration') continue;

          const name = decorator.metadata.name as string | undefined;
          const expectedOutcomes = decorator.metadata.expectedOutcomes;

          // Only check if expectedOutcomes exist
          if (!expectedOutcomes) continue;

          if (!Array.isArray(expectedOutcomes)) continue;

          // Check each outcome
          expectedOutcomes.forEach((outcome, index) => {
            if (typeof outcome !== 'object' || outcome === null) return;

            const outcomeObj = outcome as { outcome?: string; type?: string; responsibleParty?: unknown };

            // Check if outcome description is missing
            if (!outcomeObj.outcome) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteOutcome',
                data: {
                  name: name || 'Unnamed collaboration',
                  index,
                },
              });
            }
          });
        }
      },
    };
  },
});

