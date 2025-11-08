/**
 * Journey Description Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **description** provides a detailed explanation of
 * what a journey is, when it happens, and why it matters. Without a description, journeys lack
 * context and AI systems cannot fully understand the journey's nature or generate appropriate
 * user flows.
 *
 * Description enables AI to:
 * 1. **Understand context** - Know what the journey is and when it happens
 * 2. **Generate summaries** - Create concise overviews of journeys
 * 3. **Improve communication** - Help teams communicate journey details
 * 4. **Enable discovery** - Make journeys searchable and discoverable
 *
 * Missing description makes it harder to understand journey context or generate proper
 * user flow implementations.
 *
 * **What it checks:**
 * - Journey has `description` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Journey({
 *   name: 'Instant Account Opening',
 *   description: 'End-to-end journey for customers to open a new account digitally in under 5 minutes'
 * })
 *
 * // ⚠️ Warning - Missing description
 * @Journey({
 *   name: 'Instant Account Opening'
 *   // Missing description - unclear context
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDescription';

export const journeyDescriptionRecommended = createRule<[], MessageIds>({
  name: 'journey-description-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journeys should have a description field. Description provides a detailed explanation of what the journey is, when it happens, and why it matters.',
    },
    messages: {
      missingDescription:
        "Journey '{{name}}' is missing a 'description' field. Description provides a detailed explanation of what the journey is, when it happens, and why it matters. Consider adding a description that explains the journey's nature, timing, and importance (e.g., 'description: \"End-to-end journey for customers to open a new account digitally in under 5 minutes\"').",
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
          if (decorator.type !== 'Journey') continue;

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
              data: { name: name || 'Unnamed journey' },
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
                  ? `,\n  description: '',  // TODO: Detailed explanation of what this journey is, when it happens, and why it matters`
                  : `\n  description: '',  // TODO: Detailed explanation of what this journey is, when it happens, and why it matters`;

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

