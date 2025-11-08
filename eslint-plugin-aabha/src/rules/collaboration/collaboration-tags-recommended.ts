/**
 * Collaboration Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** enable categorization and discovery of
 * collaborations. Without tags, collaborations are harder to find, group, and analyze, and AI
 * systems cannot effectively organize or filter collaborations by theme, domain, or priority.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help find related collaborations
 * 2. **Group collaborations** - Organize by theme, domain, or priority
 * 3. **Filter and search** - Quickly locate collaborations by category
 * 4. **Generate reports** - Group collaborations by tags in reports
 *
 * Missing tags make it harder to discover, organize, and analyze collaborations.
 *
 * **What it checks:**
 * - Collaboration has `tags` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   tags: ['governance', 'investment-decision', 'monthly-cadence']
 * })
 *
 * // ⚠️ Warning - Missing tags
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing tags - harder to discover and organize
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTags';

export const collaborationTagsRecommended = createRule<[], MessageIds>({
  name: 'collaboration-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a tags field. Tags enable categorization and discovery of collaborations, making them easier to find, group, and analyze.',
    },
    messages: {
      missingTags:
        "Collaboration '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of collaborations, making them easier to find, group, and analyze. Consider adding tags that categorize the collaboration by theme, domain, or priority (e.g., 'tags: [\"governance\", \"investment-decision\"]').",
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
          const tags = decorator.metadata.tags;

          // Check if tags is missing
          if (!tags) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if tags already exists in source to avoid duplicates
            if (source.includes('tags:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed collaboration' },
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
                  ? `,\n  tags: [],  // TODO: Add categorization tags`
                  : `\n  tags: [],  // TODO: Add categorization tags`;

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

