/**
 * Context Metrics Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **metrics** and **health indicators** make contexts
 * measurable and observable. "You can't improve what you don't measure" applies to organizational
 * contexts just as much as code performance. Without metrics, AI systems cannot assess context
 * health, identify improvement opportunities, or validate strategic outcomes.
 *
 * Context observability enables:
 * 1. **AI-driven performance monitoring** - AI can track context effectiveness over time and
 *    detect degradation before it impacts business outcomes
 * 2. **Automated anomaly detection** - AI can identify unusual patterns in metrics and alert
 *    stakeholders to potential issues
 * 3. **Strategic alignment validation** - AI can correlate context metrics with business
 *    objectives to validate that the context is delivering expected value
 * 4. **Resource optimization** - AI can analyze metrics to recommend where to invest or
 *    divest resources based on actual performance data
 *
 * **What it checks:**
 * - Context has either `metrics` (quantitative measures) OR `healthIndicators` (qualitative
 *   signals) defined
 * - At least one measurement approach is present and non-empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Quantitative metrics
 * @Context({
 *   name: 'Payment Processing',
 *   metrics: [SystemUptimeMetric, TransactionSuccessRateMetric, AverageProcessingTimeMetric]
 * })
 *
 * // ✅ Good - Qualitative health indicators
 * @Context({
 *   name: 'Customer Support',
 *   healthIndicators: [
 *     'Team morale is high',
 *     'Customer satisfaction above 90%',
 *     'Average resolution time under 2 hours',
 *     'Low escalation rate'
 *   ]
 * })
 *
 * // ✅ Good - Both metrics and health indicators
 * @Context({
 *   name: 'Risk & Compliance',
 *   metrics: [AuditCompletionRateMetric, ComplianceScoreMetric],
 *   healthIndicators: [
 *     'No critical audit findings',
 *     'Regulatory requirements up to date'
 *   ]
 * })
 *
 * // ❌ Bad - No metrics or health indicators
 * @Context({
 *   name: 'Analytics'
 *   // Missing both metrics and healthIndicators
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingPerformanceTracking';

export const contextMetricsRequired = createRule<[], MessageIds>({
  name: 'context-metrics-required',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Contexts should have metrics or health indicators to track operational performance and effectiveness. Measurable contexts enable AI to monitor health, detect anomalies, and validate strategic outcomes.',
    },
    messages: {
      missingPerformanceTracking: "Context '{{name}}' has no metrics or health indicators defined. In context engineering, measurability is essential - you can't improve what you don't measure. Add 'metrics' (quantitative measures like uptime, throughput, error rates) or 'healthIndicators' (qualitative signals like team morale, customer satisfaction) to enable AI-driven performance monitoring. Without metrics, AI cannot assess context health, identify improvement opportunities, or validate alignment with business objectives.",
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
          // Only apply to Context decorators
          if (decorator.type !== 'Context') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const metrics = decorator.metadata.metrics as unknown[] | undefined;
          const healthIndicators = decorator.metadata.healthIndicators as unknown[] | undefined;

          const hasMetrics = metrics && Array.isArray(metrics) && metrics.length > 0;
          const hasHealthIndicators = healthIndicators && Array.isArray(healthIndicators) && healthIndicators.length > 0;

          // Check if at least metrics OR health indicators are defined
          if (!hasMetrics && !hasHealthIndicators) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingPerformanceTracking',
              data: {
                name: name || 'Unknown',
              },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the last property to insert after
                const properties = arg.properties;
                if (properties.length === 0) return null;

                const lastProperty = properties[properties.length - 1];
                const indentation = detectIndentation(lastProperty, sourceCode);
                const insertPosition = lastProperty.range[1];

                // Add healthIndicators with TODO comment
                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}healthIndicators: [\n${indentation}  'TODO: Define health indicators (e.g., uptime, response time, error rate)'\n${indentation}]`
                );
              },
            });
          }
        }
      },
    };
  },
});
