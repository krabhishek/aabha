/**
 * Strategy Value Proposition Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **value proposition** defines the unique value the strategy creates
 * for customers. This is distinct from "how to win" - value proposition focuses on customer value,
 * while "how to win" focuses on competitive advantage. Without a value proposition, strategies lack
 * clarity about the distinctive value they deliver.
 *
 * Value proposition enables AI to:
 * 1. **Understand customer value** - Know what unique value is created for customers
 * 2. **Differentiate strategy** - Understand what makes this strategy distinct
 * 3. **Align initiatives** - Ensure initiatives deliver the promised value
 * 4. **Communicate value** - Help teams articulate strategy value to stakeholders
 *
 * **What it checks:**
 * - Strategy has `valueProposition` field defined
 * - Value proposition is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has value proposition
 * @Strategy({
 *   name: 'Digital Transformation',
 *   valueProposition: 'Instant financial services without paperwork or branch visits, powered by AI'
 * })
 *
 * // ❌ Bad - Missing value proposition
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing valueProposition
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingValueProposition' | 'emptyValueProposition';

export const strategyValuePropositionRequired = createRule<[], MessageIds>({
  name: 'strategy-value-proposition-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have valueProposition field. Value proposition defines the unique value the strategy creates for customers, distinct from competitive advantage.',
    },
    messages: {
      missingValueProposition:
        "Strategy '{{name}}' is missing a 'valueProposition' field. Value proposition defines the unique value the strategy creates for customers. This is distinct from 'how to win' - value proposition focuses on customer value, while 'how to win' focuses on competitive advantage. Add a valueProposition field that clearly articulates the distinctive value delivered (e.g., 'valueProposition: \"Instant financial services without paperwork or branch visits, powered by AI\"').",
      emptyValueProposition:
        "Strategy '{{name}}' has a valueProposition field but it's empty. Value proposition should be meaningful and clearly articulate the unique value created for customers. Add a meaningful value proposition.",
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
          const valueProposition = decorator.metadata.valueProposition as string | undefined;

          // Check if valueProposition is missing
          if (!valueProposition) {
            context.report({
              node: decorator.node,
              messageId: 'missingValueProposition',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if valueProposition already exists in source to avoid duplicates
                if (source.includes('valueProposition:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const valuePropositionTemplate = `,\n  valueProposition: '',  // TODO: Unique value we create for customers`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  valuePropositionTemplate,
                );
              },
            });
            continue;
          }

          // Check if valueProposition is empty
          if (typeof valueProposition === 'string' && valueProposition.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyValueProposition',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

