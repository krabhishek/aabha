/**
 * Metric Unit Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **unit** specifies the unit of measurement for a metric.
 * Units are essential for understanding metric values, comparing metrics, and generating
 * accurate reports. Without units, metric values are ambiguous and AI systems cannot
 * properly interpret or display metric data.
 *
 * Unit enables AI to:
 * 1. **Interpret values** - Understand what metric values represent
 * 2. **Format displays** - Display metric values with correct units
 * 3. **Compare metrics** - Ensure metrics with same units are compared correctly
 * 4. **Generate reports** - Create reports with properly formatted metric values
 *
 * **What it checks:**
 * - Metric has `unit` field defined
 * - Unit is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has unit
 * @Metric({
 *   name: 'Net Promoter Score',
 *   unit: 'score'
 * })
 *
 * // ❌ Bad - Missing unit
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing unit
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingUnit' | 'emptyUnit';

export const metricUnitRequired = createRule<[], MessageIds>({
  name: 'metric-unit-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have unit field. Unit specifies the unit of measurement, essential for understanding metric values and generating accurate reports.',
    },
    messages: {
      missingUnit:
        "Metric '{{name}}' is missing a 'unit' field. Unit specifies the unit of measurement for a metric (e.g., '%', 'USD', 'count', 'score', 'seconds'). Units are essential for understanding metric values, comparing metrics, and generating accurate reports. Add a unit field (e.g., 'unit: \"%\"' for percentage, 'unit: \"USD\"' for currency, 'unit: \"count\"' for absolute numbers).",
      emptyUnit:
        "Metric '{{name}}' has a unit field but it's empty. Unit should be meaningful and specify the unit of measurement. Add a meaningful unit.",
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
          const unit = decorator.metadata.unit as string | undefined;

          // Check if unit is missing
          if (!unit) {
            context.report({
              node: decorator.node,
              messageId: 'missingUnit',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if unit already exists in source to avoid duplicates
                if (source.includes('unit:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const unitTemplate = `,\n  unit: '',  // TODO: Unit of measurement (e.g., '%', 'USD', 'count', 'score', 'seconds')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  unitTemplate,
                );
              },
            });
            continue;
          }

          // Check if unit is empty
          if (typeof unit === 'string' && unit.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyUnit',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

