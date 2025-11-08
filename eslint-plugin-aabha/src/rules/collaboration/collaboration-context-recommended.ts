/**
 * Collaboration Context Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **context** links a collaboration to its business
 * context. Without a context, collaborations lack organizational alignment and AI systems cannot
 * understand how the collaboration fits into broader business processes or prioritize work based
 * on context importance.
 *
 * Context enables AI to:
 * 1. **Understand alignment** - Know how collaboration supports business context
 * 2. **Prioritize work** - Understand context importance for prioritization
 * 3. **Generate reports** - Group collaborations by context in reports
 * 4. **Enable traceability** - Link collaborations to business contexts
 *
 * Missing context makes it harder to understand organizational alignment or prioritize
 * collaborations appropriately.
 *
 * **What it checks:**
 * - Collaboration has `context` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has context
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   context: InvestmentManagementContext
 * })
 *
 * // ⚠️ Warning - Missing context
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing context - no organizational alignment
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingContext';

export const collaborationContextRecommended = createRule<[], MessageIds>({
  name: 'collaboration-context-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a context field. Context links the collaboration to its business context, ensuring organizational alignment and enabling proper prioritization.',
    },
    messages: {
      missingContext:
        "Collaboration '{{name}}' is missing a 'context' field. Context links the collaboration to its business context, ensuring organizational alignment and enabling proper prioritization. Consider adding a context field that references a @Context decorated class (e.g., 'context: InvestmentManagementContext').",
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
          if (decorator.type !== 'Collaboration') continue;

          const name = decorator.metadata.name as string | undefined;
          const contextField = decorator.metadata.context;

          // Check if context is missing
          if (!contextField) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if context already exists in source to avoid duplicates
            if (source.includes('context:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingContext',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if context already exists in source to avoid duplicates
                if (source.includes('context:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const contextTemplate = needsComma
                  ? `,\n  context: undefined,  // TODO: Add @Context decorated class`
                  : `\n  context: undefined,  // TODO: Add @Context decorated class`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  contextTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

