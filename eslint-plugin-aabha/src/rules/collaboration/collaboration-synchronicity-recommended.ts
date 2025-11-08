/**
 * Collaboration Synchronicity Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **synchronicity** defines whether a collaboration
 * is synchronous (all participants interact at the same time) or asynchronous (participants
 * interact at different times). Without synchronicity, collaborations lack clarity on
 * interaction timing and AI systems cannot generate appropriate scheduling or coordination code.
 *
 * Synchronicity enables AI to:
 * 1. **Generate scheduling** - Create appropriate scheduling logic based on synchronicity
 * 2. **Enable coordination** - Apply synchronicity-specific coordination approaches
 * 3. **Plan resources** - Allocate resources based on synchronicity requirements
 * 4. **Track patterns** - Understand collaboration interaction timing
 *
 * Missing synchronicity makes it harder to schedule or coordinate collaborations effectively.
 *
 * **What it checks:**
 * - Collaboration has `synchronicity` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has synchronicity
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   synchronicity: 'synchronous'
 * })
 *
 * // ⚠️ Warning - Missing synchronicity
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing synchronicity - unclear interaction timing
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingSynchronicity';

export const collaborationSynchronicityRecommended = createRule<[], MessageIds>({
  name: 'collaboration-synchronicity-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a synchronicity field. Synchronicity defines whether participants interact at the same time (synchronous) or at different times (asynchronous), enabling appropriate scheduling and coordination.',
    },
    messages: {
      missingSynchronicity:
        "Collaboration '{{name}}' is missing a 'synchronicity' field. Synchronicity defines whether participants interact at the same time (synchronous) or at different times (asynchronous), enabling appropriate scheduling and coordination. Consider adding a synchronicity (e.g., 'synchronicity: \"synchronous\"', 'synchronicity: \"asynchronous\"', 'synchronicity: \"mixed\"').",
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
          const synchronicity = decorator.metadata.synchronicity;

          // Check if synchronicity is missing
          if (!synchronicity) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if synchronicity already exists in source to avoid duplicates
            if (source.includes('synchronicity:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingSynchronicity',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if synchronicity already exists in source to avoid duplicates
                if (source.includes('synchronicity:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const synchronicityTemplate = needsComma
                  ? `,\n  synchronicity: 'synchronous',  // TODO: Choose appropriate synchronicity (synchronous, asynchronous, mixed)`
                  : `\n  synchronicity: 'synchronous',  // TODO: Choose appropriate synchronicity (synchronous, asynchronous, mixed)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  synchronicityTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

