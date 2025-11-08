/**
 * Initiative Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tags** enable categorization and discovery of business
 * initiatives. Without tags, initiatives are harder to find, group, and analyze, and AI systems cannot
 * effectively organize or filter initiatives by theme, domain, or priority.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help find related initiatives
 * 2. **Group initiatives** - Organize by theme, domain, or priority
 * 3. **Filter and search** - Quickly locate initiatives by category
 * 4. **Generate reports** - Group initiatives by tags in reports
 *
 * Missing tags make it harder to discover, organize, and analyze initiatives.
 *
 * **What it checks:**
 * - Initiative has `tags` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   tags: ['digital-transformation', 'onboarding', 'customer-experience']
 * })
 *
 * // ⚠️ Warning - Missing tags
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing tags - harder to discover and organize
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTags';

export const initiativeTagsRecommended = createRule<[], MessageIds>({
  name: 'initiative-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a tags field. Tags enable categorization and discovery of initiatives, making them easier to find, group, and analyze.',
    },
    messages: {
      missingTags:
        "Initiative '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of initiatives, making them easier to find, group, and analyze. Consider adding tags that categorize the initiative by theme, domain, or priority (e.g., 'tags: [\"digital-transformation\", \"onboarding\"]').",
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
          if (decorator.type !== 'BusinessInitiative') continue;

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
              data: { name: name || 'Unnamed initiative' },
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

