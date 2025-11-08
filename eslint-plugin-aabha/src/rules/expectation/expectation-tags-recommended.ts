/**
 * Expectation Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** provide categorization and searchability
 * for expectations. Tags help organize expectations by domain, feature area, stakeholder type, or
 * any other meaningful classification, making them easier to discover and manage. Without tags,
 * expectations are harder to filter, search, or organize.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Make expectations searchable by category
 * 2. **Organize by domain** - Group expectations by business domain or feature area
 * 3. **Filter and query** - Enable filtering by stakeholder, feature, or purpose
 * 4. **Generate reports** - Create categorized reports and dashboards
 *
 * Missing tags make it harder to discover, organize, or filter expectations.
 *
 * **What it checks:**
 * - Expectation should have `tags` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   tags: ['authentication', 'validation', 'signup', 'customer-facing']
 * })
 *
 * // ⚠️ Warning - Missing tags
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing tags - harder to discover and organize
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTags';

export const expectationTagsRecommended = createRule<[], MessageIds>({
  name: 'expectation-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have tags field. Tags provide categorization and searchability for expectations.',
    },
    messages: {
      missingTags:
        "Expectation '{{name}}' is missing a 'tags' field. Tags provide categorization and searchability for expectations, making them easier to discover and organize. Consider adding tags (e.g., 'tags: [\"authentication\", \"validation\", \"signup\"]').",
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
          if (decorator.type !== 'Expectation') continue;

          const name = decorator.metadata.name as string | undefined;
          const tags = decorator.metadata.tags;

          // Check if tags is missing
          if (!tags || (Array.isArray(tags) && tags.length === 0)) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if tags already exists in source to avoid duplicates
            if (source.includes('tags:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if tags already exists in source to avoid duplicates
                if (source.includes('tags:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const tagsTemplate = needsComma
                  ? `,\n  tags: [],  // TODO: Add tags for categorization (e.g., ['authentication', 'validation', 'signup'])`
                  : `\n  tags: [],  // TODO: Add tags for categorization (e.g., ['authentication', 'validation', 'signup'])`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  tagsTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

