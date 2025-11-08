/**
 * Interaction Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** provide categorization and searchability for
 * interactions. Tags help organize interactions by domain, technology, team, or any other meaningful
 * classification, making them easier to discover and manage.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Make interactions searchable by category
 * 2. **Organize by domain** - Group interactions by business domain
 * 3. **Filter and query** - Enable filtering by technology, team, or purpose
 * 4. **Generate reports** - Create categorized reports and dashboards
 *
 * Missing tags make it harder to discover, organize, or filter interactions.
 *
 * **What it checks:**
 * - Interactions should have `tags` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Interaction({
 *   name: 'Account Opening API',
 *   tags: ['api', 'account-management', 'backend', 'critical']
 * })
 *
 * // ⚠️ Warning - Missing tags
 * @Interaction({
 *   name: 'Account Opening API'
 *   // Missing tags - harder to discover and organize
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTags';

export const interactionTagsRecommended = createRule<[], MessageIds>({
  name: 'interaction-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interactions should have tags field. Tags provide categorization and searchability for interactions.',
    },
    messages: {
      missingTags:
        "Interaction '{{name}}' is missing a 'tags' field. Tags provide categorization and searchability for interactions, making them easier to discover and organize. Consider adding tags (e.g., 'tags: [\"api\", \"account-management\", \"backend\"]').",
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
          if (decorator.type !== 'Interaction') continue;

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
              data: { name: name || 'Unnamed interaction' },
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
                  ? `,\n  tags: [],  // TODO: Add tags for categorization (e.g., ['api', 'account-management', 'backend'])`
                  : `\n  tags: [],  // TODO: Add tags for categorization (e.g., ['api', 'account-management', 'backend'])`;

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

