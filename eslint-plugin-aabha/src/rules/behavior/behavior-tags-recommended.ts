/**
 * Behavior Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** enable categorization and discovery of behaviors.
 * Tags help teams find related behaviors, filter behaviors by characteristics, and organize behaviors for
 * better navigation. While not always required, tags improve behavior discoverability and organization.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help teams find behaviors by characteristics
 * 2. **Filter behaviors** - Organize and filter behaviors by tags
 * 3. **Generate taxonomies** - Create behavior categorization systems
 * 4. **Improve navigation** - Organize behaviors for better browsing
 *
 * **What it checks:**
 * - Behavior should have `tags` field (recommended, not required)
 * - When tags are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Behavior({
 *   name: 'Validate Email Format',
 *   tags: ['validation', 'email', 'reusable']
 * })
 *
 * // ⚠️ Warning - Missing tags (recommended)
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing tags - consider adding tags for categorization
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTags' | 'emptyTags';

export const behaviorTagsRecommended = createRule<[], MessageIds>({
  name: 'behavior-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have tags field. Tags enable categorization and discovery of behaviors, improving organization and navigation.',
    },
    messages: {
      missingTags:
        "Behavior '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of behaviors. Tags help teams find related behaviors, filter behaviors by characteristics, and organize behaviors for better navigation. While not always required, tags improve behavior discoverability. Add a tags array (e.g., 'tags: [\"validation\", \"email\", \"reusable\"]').",
      emptyTags:
        "Behavior '{{name}}' has a tags field but it's empty. Tags should be meaningful and help categorize the behavior. Add meaningful tags.",
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
          if (decorator.type !== 'Behavior') continue;

          const name = decorator.metadata.name as string | undefined;
          const tags = decorator.metadata.tags as string[] | undefined;

          // Check if tags is missing (recommended, not required)
          if (!tags) {
            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed behavior' },
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
                
                const tagsTemplate = needsComma
                  ? `,\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'validation', 'email', 'reusable')\n  ]`
                  : `\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'validation', 'email', 'reusable')\n  ]`;

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
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

