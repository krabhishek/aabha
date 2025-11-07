/**
 * Metric Calculation Method Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **calculation methods** explain how metrics are computed,
 * enabling reproducibility and understanding. Metrics without calculation methods create
 * ambiguity - AI systems can't verify calculations, generate implementation code, or
 * understand how metric values are derived.
 *
 * Calculation methods enable AI to:
 * 1. **Verify calculations** - Understand how metric values are computed
 * 2. **Generate implementation code** - Create code that calculates metrics
 * 3. **Debug metric issues** - Trace problems in calculation logic
 * 4. **Ensure consistency** - Standardize how metrics are calculated across systems
 *
 * Missing calculation methods mean AI can't verify or reproduce metric calculations.
 *
 * **What it checks:**
 * - Metric decorators have a `calculation` field
 * - Calculation is a non-empty string describing how the metric is computed
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Calculation method specified
 * @Metric({
 *   name: 'Cart Abandonment Rate',
 *   calculation: '(abandoned_carts / total_carts) * 100'
 * })
 * export class CartAbandonmentRate {}
 *
 * // ❌ Bad - Missing calculation method
 * @Metric({
 *   name: 'Cart Abandonment Rate'
 *   // Missing calculation - how is this computed?
 * })
 * export class CartAbandonmentRate {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCalculation' | 'emptyCalculation';

export const metricCalculationMethod = createRule<[], MessageIds>({
  name: 'metric-calculation-method',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics should have calculation methods to enable reproducibility and understanding',
    },
    messages: {
      missingCalculation: "Metric '{{name}}' is missing a 'calculation' field. Calculation methods explain how metrics are computed, enabling AI systems to verify calculations, generate implementation code, and understand how metric values are derived. Add a calculation field describing the formula or method (e.g., 'calculation: \"(abandoned_carts / total_carts) * 100\"').",
      emptyCalculation: "Metric '{{name}}' has an empty calculation field. Calculation methods must be non-empty to explain how metrics are computed. Add a valid calculation formula or method description.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Metric decorators
          if (decorator.type !== 'Metric') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const calculation = decorator.metadata.calculation as string | undefined;

          if (!calculation) {
            context.report({
              node: decorator.node,
              messageId: 'missingCalculation',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          } else if (typeof calculation === 'string' && calculation.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyCalculation',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          }
        }
      },
    };
  },
});
