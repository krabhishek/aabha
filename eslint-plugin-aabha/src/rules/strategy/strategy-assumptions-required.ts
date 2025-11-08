/**
 * Strategy Assumptions Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **assumptions** are critical assumptions that the strategy depends on.
 * Explicitly documenting assumptions helps identify risks, validate strategy viability, and recognize
 * when assumptions change. Without documented assumptions, strategies may be built on unstated premises
 * that could invalidate the strategy if they change.
 *
 * Assumptions enable AI to:
 * 1. **Identify risks** - Know what assumptions could invalidate the strategy
 * 2. **Validate strategy** - Check if assumptions are still valid
 * 3. **Monitor changes** - Alert when assumptions change or are invalidated
 * 4. **Make informed decisions** - Understand what the strategy depends on
 *
 * **What it checks:**
 * - Strategy has `assumptions` field defined
 * - Assumptions array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has assumptions
 * @Strategy({
 *   name: 'Digital Transformation',
 *   assumptions: [
 *     'Mobile penetration continues to grow at 20% annually',
 *     'Customers value speed over personal touch',
 *     'Regulatory environment remains favorable to digital banking'
 *   ]
 * })
 *
 * // ❌ Bad - Missing assumptions
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing assumptions
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingAssumptions' | 'emptyAssumptions';

export const strategyAssumptionsRequired = createRule<[], MessageIds>({
  name: 'strategy-assumptions-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have assumptions field. Assumptions are critical premises that the strategy depends on, helping identify risks and validate strategy viability.',
    },
    messages: {
      missingAssumptions:
        "Strategy '{{name}}' is missing an 'assumptions' field. Assumptions are critical premises that the strategy depends on. Explicitly documenting assumptions helps identify risks, validate strategy viability, and recognize when assumptions change. Add an assumptions array with critical assumptions (e.g., 'assumptions: [\"Mobile penetration continues to grow\", \"Customers value speed over personal touch\"]').",
      emptyAssumptions:
        "Strategy '{{name}}' has an assumptions field but it's empty. Assumptions should be meaningful and document critical premises that the strategy depends on. Add meaningful assumptions that underpin strategic choices.",
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Strategy') continue;

          const name = decorator.metadata.name as string | undefined;
          const assumptions = decorator.metadata.assumptions as string[] | undefined;

          // Check if assumptions is missing
          if (!assumptions) {
            context.report({
              node: decorator.node,
              messageId: 'missingAssumptions',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if assumptions already exists in source to avoid duplicates
                if (source.includes('assumptions:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const assumptionsTemplate = `,\n  assumptions: [\n    '', // TODO: Critical assumptions this strategy depends on\n    '' // TODO: Add more assumptions (e.g., market trends, customer preferences, regulatory environment)\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  assumptionsTemplate,
                );
              },
            });
            continue;
          }

          // Check if assumptions is empty
          if (assumptions.length === 0 || assumptions.every((a) => typeof a === 'string' && a.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyAssumptions',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

