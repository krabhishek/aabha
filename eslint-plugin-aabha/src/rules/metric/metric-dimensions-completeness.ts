/**
 * Metric Dimensions Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **dimensions** define how metrics can be sliced and aggregated.
 * When a dimensions object is provided, it should include the `dimensions` array to specify
 * available dimensions for analysis. Incomplete dimensions objects lack the information needed
 * for multi-dimensional metric analysis.
 *
 * Dimensions completeness enables AI to:
 * 1. **Enable slicing** - Know available dimensions for metric analysis
 * 2. **Configure aggregation** - Set up dimension-based aggregation
 * 3. **Generate reports** - Create dimension-based metric reports
 * 4. **Support analysis** - Enable multi-dimensional metric exploration
 *
 * **What it checks:**
 * - If dimensions exists, it should have `dimensions` array
 * - Dimensions array should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete dimensions
 * @Metric({
 *   name: 'Conversion Rate',
 *   dimensions: {
 *     dimensions: ['channel', 'region', 'segment'],
 *     defaultDimension: 'channel',
 *     aggregationMethod: 'weighted-average'
 *   }
 * })
 *
 * // ❌ Bad - Incomplete dimensions
 * @Metric({
 *   name: 'Conversion Rate',
 *   dimensions: {
 *     // Missing dimensions array
 *   }
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDimensionsArray' | 'emptyDimensionsArray';

export const metricDimensionsCompleteness = createRule<[], MessageIds>({
  name: 'metric-dimensions-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics with dimensions field should have complete dimensions objects. Dimensions objects should include the dimensions array to specify available dimensions for analysis.',
    },
    messages: {
      missingDimensionsArray:
        "Metric '{{name}}' has dimensions object but missing 'dimensions' array. Dimensions objects require the 'dimensions' array to specify available dimensions for slicing and analysis. Add a dimensions array (e.g., 'dimensions: [\"channel\", \"region\", \"segment\"]').",
      emptyDimensionsArray:
        "Metric '{{name}}' has dimensions object with dimensions array but it's empty. Dimensions array should be meaningful and specify available dimensions for analysis. Add meaningful dimensions.",
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
          const dimensions = decorator.metadata.dimensions as
            | {
                dimensions?: string[];
                defaultDimension?: string;
                aggregationMethod?: string;
                rollupRules?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if dimensions exists
          if (!dimensions) continue;

          // Check if dimensions.dimensions is missing
          if (!dimensions.dimensions) {
            context.report({
              node: decorator.node,
              messageId: 'missingDimensionsArray',
              data: { name: name || 'Unnamed metric' },
            });
            continue;
          }

          // Check if dimensions.dimensions is empty
          if (dimensions.dimensions.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDimensionsArray',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

