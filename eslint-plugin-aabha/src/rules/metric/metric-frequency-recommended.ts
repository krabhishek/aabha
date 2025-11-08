/**
 * Metric Frequency Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **frequency** specifies how often a metric is measured
 * (e.g., "real-time", "daily", "weekly"). Frequency helps teams understand metric update
 * cadence, enables AI systems to schedule data collection, and supports alerting configuration.
 * While not always required, frequency is important for operational metrics and monitoring.
 *
 * Frequency enables AI to:
 * 1. **Schedule collection** - Know when to fetch metric data
 * 2. **Set expectations** - Understand metric update cadence
 * 3. **Configure alerting** - Set appropriate alert frequencies
 * 4. **Optimize resources** - Plan data collection efficiently
 *
 * **What it checks:**
 * - Metric should have `frequency` field (recommended, not required)
 * - Frequency is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has frequency
 * @Metric({
 *   name: 'Net Promoter Score',
 *   frequency: 'daily'
 * })
 *
 * // ⚠️ Warning - Missing frequency (recommended)
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing frequency - consider adding measurement frequency
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingFrequency' | 'emptyFrequency';

export const metricFrequencyRecommended = createRule<[], MessageIds>({
  name: 'metric-frequency-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have frequency field. Frequency specifies how often a metric is measured, helping teams understand update cadence and enabling proper data collection scheduling.',
    },
    messages: {
      missingFrequency:
        "Metric '{{name}}' is missing a 'frequency' field. Frequency specifies how often a metric is measured (e.g., 'real-time', 'daily', 'weekly', 'monthly'). Frequency helps teams understand metric update cadence, enables AI systems to schedule data collection, and supports alerting configuration. Add a frequency field (e.g., 'frequency: \"daily\"' or 'frequency: \"real-time\"').",
      emptyFrequency:
        "Metric '{{name}}' has a frequency field but it's empty. Frequency should be meaningful and specify measurement cadence. Add a meaningful frequency.",
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
          const frequency = decorator.metadata.frequency as string | undefined;

          // Check if frequency is missing (recommended, not required)
          if (!frequency) {
            context.report({
              node: decorator.node,
              messageId: 'missingFrequency',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if frequency already exists in source to avoid duplicates
                if (source.includes('frequency:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const frequencyTemplate = `,\n  frequency: '',  // TODO: Measurement frequency (e.g., 'real-time', 'daily', 'weekly', 'monthly')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  frequencyTemplate,
                );
              },
            });
            continue;
          }

          // Check if frequency is empty
          if (typeof frequency === 'string' && frequency.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyFrequency',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

