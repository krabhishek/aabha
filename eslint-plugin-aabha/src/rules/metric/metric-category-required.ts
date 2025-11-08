/**
 * Metric Category Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **category** classifies metrics to enable category-specific
 * validation, analysis, and reporting. Categories help organize metrics, enable filtering,
 * and support category-specific best practices. Without categories, metrics lack organization
 * and AI systems cannot apply category-specific rules or generate category-based reports.
 *
 * Category enables AI to:
 * 1. **Organize metrics** - Group metrics by category for better navigation
 * 2. **Apply category rules** - Use category-specific validation and analysis
 * 3. **Generate reports** - Create category-based dashboards and summaries
 * 4. **Enable filtering** - Filter metrics by category for focused analysis
 *
 * **What it checks:**
 * - Metric has `category` field defined
 * - Category is a valid MetricCategory enum value
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has category
 * @Metric({
 *   name: 'Net Promoter Score',
 *   category: MetricCategory.Customer
 * })
 *
 * // ❌ Bad - Missing category
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing category
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCategory';

export const metricCategoryRequired = createRule<[], MessageIds>({
  name: 'metric-category-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have category field. Category classifies metrics to enable category-specific validation, analysis, and reporting.',
    },
    messages: {
      missingCategory:
        "Metric '{{name}}' is missing a 'category' field. Category classifies metrics to enable category-specific validation, analysis, and reporting. Categories help organize metrics, enable filtering, and support category-specific best practices. Add a category field using MetricCategory enum (e.g., 'category: MetricCategory.Customer' or 'category: MetricCategory.Business').",
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
          const category = decorator.metadata.category;

          // Check if category is missing
          if (!category) {
            context.report({
              node: decorator.node,
              messageId: 'missingCategory',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if category already exists in source to avoid duplicates
                if (source.includes('category:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const categoryTemplate = `,\n  category: MetricCategory.Customer,  // TODO: Choose appropriate category (Business, Operational, Customer, Financial, Technical, Quality, Security, Compliance)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  categoryTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

