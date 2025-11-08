/**
 * Strategy Competitive Context Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **competitive context** describes the current market and competitive
 * landscape in which the strategy operates. Understanding the environment is critical for making informed
 * strategic decisions. Without competitive context, strategies lack awareness of market conditions and
 * competitive dynamics.
 *
 * Competitive context enables AI to:
 * 1. **Understand market conditions** - Know the environment in which the strategy competes
 * 2. **Assess strategy relevance** - Understand if strategy is appropriate for current market
 * 3. **Identify opportunities** - Recognize market trends and disruptions
 * 4. **Make informed decisions** - Context informs strategic choices and trade-offs
 *
 * **What it checks:**
 * - Strategy has `competitiveContext` field defined
 * - Competitive context is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has competitive context
 * @Strategy({
 *   name: 'Digital Transformation',
 *   competitiveContext: 'Fintech disruption, increasing mobile adoption, regulatory changes favoring digital banking'
 * })
 *
 * // ❌ Bad - Missing competitive context
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing competitiveContext
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCompetitiveContext' | 'emptyCompetitiveContext';

export const strategyCompetitiveContextRequired = createRule<[], MessageIds>({
  name: 'strategy-competitive-context-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have competitiveContext field. Competitive context describes the current market and competitive landscape, enabling informed strategic decisions.',
    },
    messages: {
      missingCompetitiveContext:
        "Strategy '{{name}}' is missing a 'competitiveContext' field. Competitive context describes the current market and competitive landscape in which the strategy operates. Understanding the environment is critical for making informed strategic decisions. Add a competitiveContext field that describes market conditions, competitive dynamics, and industry trends (e.g., 'competitiveContext: \"Fintech disruption, increasing mobile adoption, regulatory changes favoring digital banking\"').",
      emptyCompetitiveContext:
        "Strategy '{{name}}' has a competitiveContext field but it's empty. Competitive context should be meaningful and describe the market and competitive landscape. Add a meaningful competitive context.",
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
          const competitiveContext = decorator.metadata.competitiveContext as string | undefined;

          // Check if competitiveContext is missing
          if (!competitiveContext) {
            context.report({
              node: decorator.node,
              messageId: 'missingCompetitiveContext',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if competitiveContext already exists in source to avoid duplicates
                if (source.includes('competitiveContext:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const competitiveContextTemplate = `,\n  competitiveContext: '',  // TODO: Current market and competitive landscape`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  competitiveContextTemplate,
                );
              },
            });
            continue;
          }

          // Check if competitiveContext is empty
          if (typeof competitiveContext === 'string' && competitiveContext.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyCompetitiveContext',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

