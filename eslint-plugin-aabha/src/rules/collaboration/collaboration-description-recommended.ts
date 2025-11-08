/**
 * Collaboration Description Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **description** provides a detailed explanation of
 * what a collaboration is, when it happens, and why it matters. Without a description,
 * collaborations lack context and AI systems cannot fully understand the collaboration's nature
 * or generate appropriate coordination code.
 *
 * Description enables AI to:
 * 1. **Understand context** - Know what the collaboration is and when it happens
 * 2. **Generate summaries** - Create concise overviews of collaborations
 * 3. **Improve communication** - Help teams communicate collaboration details
 * 4. **Enable discovery** - Make collaborations searchable and discoverable
 *
 * Missing description makes it harder to understand collaboration context or generate proper
 * coordination code.
 *
 * **What it checks:**
 * - Collaboration has `description` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   description: 'Monthly meeting where investors and advisors review portfolio performance, discuss new investment opportunities, and make allocation decisions'
 * })
 *
 * // ⚠️ Warning - Missing description
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing description - unclear context
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDescription';

export const collaborationDescriptionRecommended = createRule<[], MessageIds>({
  name: 'collaboration-description-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a description field. Description provides a detailed explanation of what the collaboration is, when it happens, and why it matters.',
    },
    messages: {
      missingDescription:
        "Collaboration '{{name}}' is missing a 'description' field. Description provides a detailed explanation of what the collaboration is, when it happens, and why it matters. Consider adding a description that explains the collaboration's nature, timing, and importance (e.g., 'description: \"Monthly meeting where investors and advisors review portfolio performance and make investment decisions\"').",
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
          const description = decorator.metadata.description;

          // Check if description is missing
          if (!description) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if description already exists in source to avoid duplicates
            if (source.includes('description:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const descriptionTemplate = needsComma
                  ? `,\n  description: '',  // TODO: Detailed explanation of what this collaboration is, when it happens, and why it matters`
                  : `\n  description: '',  // TODO: Detailed explanation of what this collaboration is, when it happens, and why it matters`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  descriptionTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

