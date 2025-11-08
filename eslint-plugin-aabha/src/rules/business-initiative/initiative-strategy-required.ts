/**
 * Initiative Strategy Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **strategy** links a business initiative to its parent
 * strategic plan. Without a strategy, initiatives lack strategic alignment and AI systems cannot
 * understand how the initiative contributes to broader business goals or prioritize work based on
 * strategic importance.
 *
 * Strategy enables AI to:
 * 1. **Understand alignment** - Know how initiative supports strategic goals
 * 2. **Prioritize work** - Understand strategic importance for prioritization
 * 3. **Generate reports** - Group initiatives by strategy in reports
 * 4. **Enable traceability** - Link tactical work to strategic plans
 *
 * Missing strategy means AI systems can't understand strategic alignment or prioritize initiatives
 * appropriately.
 *
 * **What it checks:**
 * - Initiative has `strategy` field defined
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has strategy
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   strategy: DigitalTransformationStrategy
 * })
 *
 * // ❌ Bad - Missing strategy
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing strategy - no strategic alignment
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingStrategy';

export const initiativeStrategyRequired = createRule<[], MessageIds>({
  name: 'initiative-strategy-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a strategy field. Strategy links the initiative to its parent strategic plan, ensuring strategic alignment and enabling proper prioritization.',
    },
    messages: {
      missingStrategy:
        "Initiative '{{name}}' is missing a 'strategy' field. Strategy links the initiative to its parent strategic plan, ensuring strategic alignment and enabling proper prioritization. Add a strategy field that references a @Strategy decorated class (e.g., 'strategy: DigitalTransformationStrategy').",
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
          if (decorator.type !== 'BusinessInitiative') continue;

          const name = decorator.metadata.name as string | undefined;
          const strategy = decorator.metadata.strategy;

          // Check if strategy is missing
          if (!strategy) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if strategy already exists in source to avoid duplicates
            if (source.includes('strategy:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingStrategy',
              data: { name: name || 'Unnamed initiative' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if strategy already exists in source to avoid duplicates
                if (source.includes('strategy:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const strategyTemplate = needsComma
                  ? `,\n  strategy: undefined,  // TODO: Add @Strategy decorated class`
                  : `\n  strategy: undefined,  // TODO: Add @Strategy decorated class`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  strategyTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

