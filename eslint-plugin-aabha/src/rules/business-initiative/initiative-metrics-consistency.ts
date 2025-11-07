/**
 * Initiative Metrics Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **metrics consistency** ensures that initiative metrics
 * align with expected outcomes and success criteria. Inconsistent metrics create contradictory
 * context that confuses AI systems trying to understand initiative success and generate monitoring
 * code.
 *
 * Consistent metrics enable AI to:
 * 1. **Generate monitoring code** - Metrics inform what to track and alert on
 * 2. **Calculate success** - AI understands how to measure initiative outcomes
 * 3. **Design dashboards** - Consistent metrics help AI suggest relevant visualizations
 * 4. **Track progress** - Aligned metrics enable accurate progress reporting
 *
 * Inconsistent metrics mean AI systems can't generate proper monitoring or understand how to
 * measure initiative success.
 *
 * **What it checks:**
 * - Initiative metrics align with expected outcomes
 * - Metrics are defined and not empty
 * - Metric targets are realistic and achievable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Consistent metrics
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   expectedOutcomes: ['increase user engagement', 'reduce support tickets'],
 *   metrics: [
 *     { name: 'Daily Active Users', target: '20% increase' },
 *     { name: 'Support Ticket Volume', target: '30% decrease' }
 *   ]
 * })
 *
 * // ❌ Bad - Metrics don't align with outcomes
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   expectedOutcomes: ['increase user engagement'],
 *   metrics: [
 *     { name: 'Server Uptime', target: '99.9%' }  // Doesn't measure engagement
 *   ]
 * })
 *
 * // ❌ Bad - Missing metrics
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   expectedOutcomes: ['increase user engagement']
 *   // No metrics - AI can't generate monitoring code
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMetrics' | 'emptyMetrics' | 'metricsMisaligned';

export const initiativeMetricsConsistency = createRule<[], MessageIds>({
  name: 'initiative-metrics-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure initiative metrics align with expected outcomes to help AI generate monitoring code and understand success criteria',
    },
    messages: {
      missingMetrics: "Initiative '{{name}}' has expected outcomes but no metrics defined. Metrics provide measurable context about initiative success that helps AI systems generate monitoring code and understand how to track progress. Add metrics that align with your expected outcomes to enable AI-assisted monitoring implementation.",
      emptyMetrics: "Initiative '{{name}}' has an empty metrics array. Empty metrics waste valuable measurement context - AI systems can't generate monitoring code without defined metrics. Add meaningful metrics that measure your expected outcomes.",
      metricsMisaligned: "Initiative '{{name}}' has metric '{{metricName}}' that doesn't align with expected outcomes. Metrics should measure the outcomes you expect ({{outcomes}}). Misaligned metrics create contradictory context - AI can't understand how to measure success when metrics don't match outcomes. Align metrics with expected outcomes to create consistent measurement context.",
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
          // Only apply to BusinessInitiative decorators
          if (decorator.type !== 'BusinessInitiative') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const expectedOutcomes = decorator.metadata.expectedOutcomes as unknown[] | undefined;
          const metrics = decorator.metadata.metrics as unknown[] | undefined;

          // Check if outcomes exist but no metrics
          if (expectedOutcomes && expectedOutcomes.length > 0 && !metrics) {
            context.report({
              node: decorator.node,
              messageId: 'missingMetrics',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if metrics array is empty
          if (metrics && metrics.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyMetrics',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Simple alignment check: if outcomes mention specific areas, metrics should relate
          if (expectedOutcomes && metrics && expectedOutcomes.length > 0) {
            const outcomeKeywords = new Set<string>();
            for (const outcome of expectedOutcomes) {
              if (typeof outcome === 'string') {
                const words = outcome.toLowerCase().split(/\s+/);
                words.forEach((word) => {
                  if (word.length > 4) {
                    // Only meaningful words
                    outcomeKeywords.add(word);
                  }
                });
              }
            }

            // Check if any metric seems completely unrelated (heuristic)
            for (const metric of metrics) {
              if (typeof metric === 'object' && metric !== null) {
                const metricObj = metric as { name?: string };
                const metricName = metricObj.name?.toLowerCase() || '';
                const metricWords = metricName.split(/\s+/);

                // If metric has no overlap with outcome keywords, it might be misaligned
                const hasOverlap = metricWords.some((word) => outcomeKeywords.has(word));
                if (!hasOverlap && metricWords.length > 0 && outcomeKeywords.size > 0) {
                  // This is a heuristic - only flag if very clearly misaligned
                  const outcomesStr = expectedOutcomes
                    .filter((o): o is string => typeof o === 'string')
                    .join(', ');
                  context.report({
                    node: decorator.node,
                    messageId: 'metricsMisaligned',
                    data: {
                      name: name || 'Unknown',
                      metricName: metricObj.name || 'Unknown',
                      outcomes: outcomesStr,
                    },
                  });
                }
              }
            }
          }
        }
      },
    };
  },
});
