/**
 * Metric Tags Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **tags** enable categorization and discovery of metrics.
 * Tags help teams find related metrics, filter metrics by characteristics, and organize
 * metrics for better navigation. While not always required, tags improve metric discoverability
 * and organization.
 *
 * Tags enable AI to:
 * 1. **Enable discovery** - Help teams find metrics by characteristics
 * 2. **Filter metrics** - Organize and filter metrics by tags
 * 3. **Generate taxonomies** - Create metric categorization systems
 * 4. **Improve navigation** - Organize metrics for better browsing
 *
 * **What it checks:**
 * - Metric should have `tags` field (recommended, not required)
 * - When tags are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has tags
 * @Metric({
 *   name: 'Net Promoter Score',
 *   tags: ['customer-satisfaction', 'kpi', 'strategic']
 * })
 *
 * // ⚠️ Warning - Missing tags (recommended)
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing tags - consider adding tags for categorization
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTags' | 'emptyTags';

export const metricTagsRecommended = createRule<[], MessageIds>({
  name: 'metric-tags-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have tags field. Tags enable categorization and discovery of metrics, improving organization and navigation.',
    },
    messages: {
      missingTags:
        "Metric '{{name}}' is missing a 'tags' field. Tags enable categorization and discovery of metrics. Tags help teams find related metrics, filter metrics by characteristics, and organize metrics for better navigation. While not always required, tags improve metric discoverability. Add a tags array (e.g., 'tags: [\"customer-satisfaction\", \"kpi\", \"strategic\"]').",
      emptyTags:
        "Metric '{{name}}' has a tags field but it's empty. Tags should be meaningful and help categorize the metric. Add meaningful tags.",
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
          if (decorator.type !== 'Metric') continue;

          const name = decorator.metadata.name as string | undefined;
          const tags = decorator.metadata.tags as string[] | undefined;

          // Check if tags is missing (recommended, not required)
          if (!tags) {
            context.report({
              node: decorator.node,
              messageId: 'missingTags',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if tags already exists in source to avoid duplicates
                if (source.includes('tags:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const tagsTemplate = `,\n  tags: [\n    '', // TODO: Tags for categorization and discovery\n    '' // TODO: Add more tags (e.g., 'customer-satisfaction', 'kpi', 'strategic')\n  ]`;

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
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

