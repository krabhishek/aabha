/**
 * Initiative Metrics Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **metrics** link business initiatives to the metrics
 * that track their success. Without metric references, initiatives lack clear success measurement
 * and AI systems cannot generate proper monitoring code or track initiative progress.
 *
 * Metrics enable AI to:
 * 1. **Track success** - Know what metrics to monitor for initiative success
 * 2. **Generate monitoring** - Create code to track initiative metrics
 * 3. **Report progress** - Show initiative progress using metrics
 * 4. **Enable measurement** - Understand how to measure initiative outcomes
 *
 * Missing metric references make it harder to track initiative success or generate monitoring code.
 *
 * **What it checks:**
 * - Initiative has `metrics` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has metrics
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   metrics: [AccountOpeningTime, NetPromoterScore]
 * })
 *
 * // ⚠️ Warning - Missing metrics
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing metrics - unclear how to measure success
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingMetrics';

export const initiativeMetricsRecommended = createRule<[], MessageIds>({
  name: 'initiative-metrics-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a metrics field. Metrics link initiatives to the metrics that track their success, enabling proper progress monitoring.',
    },
    messages: {
      missingMetrics:
        "Initiative '{{name}}' is missing a 'metrics' field. Metrics link initiatives to the metrics that track their success, enabling proper progress monitoring. Consider adding metrics that reference @Metric decorated classes (e.g., 'metrics: [AccountOpeningTime, NetPromoterScore]').",
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
          const metrics = decorator.metadata.metrics;

          // Check if metrics is missing
          if (!metrics) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if metrics already exists in source to avoid duplicates
            if (source.includes('metrics:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingMetrics',
              data: { name: name || 'Unnamed initiative' },
                            fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if metrics already exists in source to avoid duplicates
                if (source.includes('metrics:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const metricsTemplate = needsComma
                  ? `,\n  metrics: [],  // TODO: Add @Metric decorated classes`
                  : `\n  metrics: [],  // TODO: Add @Metric decorated classes`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  metricsTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

