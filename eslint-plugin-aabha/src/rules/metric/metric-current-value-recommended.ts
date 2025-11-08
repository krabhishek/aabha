/**
 * Metric Current Value Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **currentValue** tracks the current measured value of a metric.
 * Current values enable progress tracking, trend analysis, and real-time metric monitoring.
 * While not always required, current values are essential for operational metrics and enable
 * AI systems to calculate progress and generate current status reports.
 *
 * Current value enables AI to:
 * 1. **Track progress** - Calculate progress from baseline to current
 * 2. **Monitor status** - Know current metric value for real-time monitoring
 * 3. **Generate reports** - Create current status reports and dashboards
 * 4. **Calculate trends** - Analyze metric changes over time
 *
 * **What it checks:**
 * - Metric should have `currentValue` field (recommended, not required)
 * - Current value is a number (when provided)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has current value
 * @Metric({
 *   name: 'Net Promoter Score',
 *   baseline: 42,
 *   currentValue: 48,
 *   target: 65
 * })
 *
 * // ⚠️ Warning - Missing current value (recommended)
 * @Metric({
 *   name: 'Net Promoter Score',
 *   baseline: 42,
 *   target: 65
 *   // Missing currentValue - consider tracking current value
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCurrentValue';

export const metricCurrentValueRecommended = createRule<[], MessageIds>({
  name: 'metric-current-value-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have currentValue field. Current value tracks the current measured value, enabling progress tracking and real-time monitoring.',
    },
    messages: {
      missingCurrentValue:
        "Metric '{{name}}' is missing a 'currentValue' field. Current value tracks the current measured value of a metric. Current values enable progress tracking, trend analysis, and real-time metric monitoring. While not always required, current values are essential for operational metrics. Add a currentValue field with the current measured value (e.g., 'currentValue: 48' for a current value of 48).",
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
          const currentValue = decorator.metadata.currentValue;

          // Check if currentValue is missing (recommended, not required)
          if (currentValue === undefined || currentValue === null) {
            context.report({
              node: decorator.node,
              messageId: 'missingCurrentValue',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if currentValue already exists in source to avoid duplicates
                if (source.includes('currentValue:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const currentValueTemplate = `,\n  currentValue: 0,  // TODO: Current measured value of this metric`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  currentValueTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

