/**
 * Metric Direction Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **direction** specifies whether higher values are better
 * or lower values are better. Direction is critical for interpreting metric health,
 * calculating progress, and generating alerts. Without direction, AI systems cannot
 * determine if a metric value is good or bad, or if progress is positive or negative.
 *
 * Direction enables AI to:
 * 1. **Interpret health** - Know if current value is good or bad
 * 2. **Calculate progress** - Understand if progress is positive or negative
 * 3. **Generate alerts** - Identify when metrics move in wrong direction
 * 4. **Set thresholds** - Align thresholds with direction (higher vs lower)
 *
 * **What it checks:**
 * - Metric has `direction` field defined
 * - Direction is either 'higher-is-better' or 'lower-is-better'
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has direction
 * @Metric({
 *   name: 'Net Promoter Score',
 *   direction: 'higher-is-better'
 * })
 *
 * // ❌ Bad - Missing direction
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing direction - can't interpret if value is good or bad
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDirection';

export const metricDirectionRequired = createRule<[], MessageIds>({
  name: 'metric-direction-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Metrics should have direction field. Direction specifies whether higher or lower values are better, critical for interpreting metric health and progress.',
    },
    messages: {
      missingDirection:
        "Metric '{{name}}' is missing a 'direction' field. Direction specifies whether higher values are better ('higher-is-better') or lower values are better ('lower-is-better'). Direction is critical for interpreting metric health, calculating progress, and generating alerts. Without direction, AI systems cannot determine if a metric value is good or bad. Add a direction field (e.g., 'direction: \"higher-is-better\"' for metrics like NPS, satisfaction, revenue, or 'direction: \"lower-is-better\"' for metrics like error rate, latency, cost).",
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
          const direction = decorator.metadata.direction;

          // Check if direction is missing
          if (!direction) {
            context.report({
              node: decorator.node,
              messageId: 'missingDirection',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if direction already exists in source to avoid duplicates
                if (source.includes('direction:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const directionTemplate = `,\n  direction: 'higher-is-better',  // TODO: 'higher-is-better' or 'lower-is-better'`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  directionTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

