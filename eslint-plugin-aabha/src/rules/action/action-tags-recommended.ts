/**
 * Action Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** enable categorization and discovery of actions.
 * Tags help teams find related actions, filter actions by characteristics, and organize actions for
 * better navigation. While not always required, tags improve action discoverability and organization.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help teams find actions by characteristics
 * 2. **Filter actions** - Organize and filter actions by tags
 * 3. **Generate taxonomies** - Create action categorization systems
 * 4. **Improve navigation** - Organize actions for better browsing
 *
 * **What it checks:**
 * - Action should have `tags` field (recommended, not required)
 * - When tags are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Action({
 *   name: 'Email Verified',
 *   tags: ['authentication', 'customer-facing', 'critical-path']
 * })
 *
 * // ⚠️ Warning - Missing tags (recommended)
 * @Action({
 *   name: 'Email Verified'
 *   // Missing tags - consider adding tags for categorization
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTags' | 'emptyTags';

export const actionTagsRecommended = createRule<[], MessageIds>({
  name: 'action-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions should have tags field. Tags enable categorization and discovery of actions, improving organization and navigation.',
    },
    messages: {
      missingTags:
        "Action '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of actions. Tags help teams find related actions, filter actions by characteristics, and organize actions for better navigation. While not always required, tags improve action discoverability. Add a tags array (e.g., 'tags: [\"authentication\", \"customer-facing\", \"critical-path\"]').",
      emptyTags:
        "Action '{{name}}' has a tags field but it's empty. Tags should be meaningful and help categorize the action. Add meaningful tags.",
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
          if (decorator.type !== 'Action') continue;

          const name = decorator.metadata.name as string | undefined;
          const tags = decorator.metadata.tags as string[] | undefined;

          // Check if tags is missing (recommended, not required)
          if (!tags) {
            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if tags already exists in source to avoid duplicates
                if (source.includes('tags:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const tagsTemplate = needsComma
                  ? `,\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'authentication', 'customer-facing', 'critical-path')\n  ]`
                  : `\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'authentication', 'customer-facing', 'critical-path')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  tagsTemplate,
                );
              },
            });
            continue;
          }

          // Check if tags is empty
          if (tags.length === 0 || tags.every((t) => typeof t === 'string' && t.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyTags',
              data: { name: name || 'Unnamed action' },
            });
          }
        }
      },
    };
  },
});

