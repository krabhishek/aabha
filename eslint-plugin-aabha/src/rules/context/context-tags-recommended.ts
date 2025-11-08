/**
 * Context Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** enable categorization and discovery of contexts.
 * Tags help teams find related contexts, filter contexts by characteristics, and organize contexts
 * for better navigation. While not always required, tags improve context discoverability and
 * organization.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help teams find contexts by characteristics
 * 2. **Filter contexts** - Organize and filter contexts by tags
 * 3. **Generate taxonomies** - Create context categorization systems
 * 4. **Improve navigation** - Organize contexts for better browsing
 *
 * **What it checks:**
 * - Context should have `tags` field (recommended, not required)
 * - When tags are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Context({
 *   name: 'Retail Banking',
 *   tags: ['customer-facing', 'core-banking', 'regulated']
 * })
 *
 * // ⚠️ Warning - Missing tags (recommended)
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing tags - consider adding tags for categorization
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTags' | 'emptyTags';

export const contextTagsRecommended = createRule<[], MessageIds>({
  name: 'context-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have tags field. Tags enable categorization and discovery of contexts, improving organization and navigation.',
    },
    messages: {
      missingTags:
        "Context '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of contexts. Tags help teams find related contexts, filter contexts by characteristics, and organize contexts for better navigation. While not always required, tags improve context discoverability. Add a tags array (e.g., 'tags: [\"customer-facing\", \"core-banking\", \"regulated\"]').",
      emptyTags:
        "Context '{{name}}' has a tags field but it's empty. Tags should be meaningful and help categorize the context. Add meaningful tags.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const tags = decorator.metadata.tags as string[] | undefined;

          // Check if tags is missing (recommended, not required)
          if (!tags) {
            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if tags already exists in source to avoid duplicates
                if (source.includes('tags:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const tagsTemplate = `,\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'customer-facing', 'core-banking', 'regulated')\n  ]`;

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
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

