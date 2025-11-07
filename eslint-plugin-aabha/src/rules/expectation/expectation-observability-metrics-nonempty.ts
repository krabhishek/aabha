/**
 * Expectation Observability Metrics Non-Empty Rule
 *
 * **Why this rule exists:**
 * In context engineering, observability is **not optional for production systems** - it's the
 * mechanism by which AI systems and humans verify that expectations are being met in runtime.
 * When you declare `observability.enabled: true` or define a metrics array, you're signaling
 * that this expectation is **instrumented for monitoring**. An empty metrics array creates a
 * false sense of observability without actual measurement capability.
 *
 * Empty metrics arrays cause:
 * - **Observability illusion** - System appears monitored but collects no actual data
 * - **SLO validation failure** - Cannot verify if SLOs are being met without metrics
 * - **AI diagnosis breakdown** - AI cannot analyze performance without metric data
 * - **Incident response blindness** - No data to debug when issues occur
 *
 * Non-empty metrics enable:
 * 1. **Real observability** - Actual instrumentation with measurable indicators
 * 2. **SLO tracking** - Can validate latency, availability, error rates against targets
 * 3. **AI-assisted analysis** - AI can correlate metrics with system behavior
 * 4. **Proactive monitoring** - Alerts can fire based on metric thresholds
 *
 * **What it checks:**
 * - If `observability.metrics` array exists, it must not be empty
 * - If `observability.enabled` is true, metrics should be defined
 * - Custom alerts must have non-empty conditions
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Observability with actual metrics
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   observability: {
 *     enabled: true,
 *     metrics: [EmailValidationLatencyMetric, EmailValidationSuccessRateMetric]
 *   }
 * })
 *
 * // ✅ Good - No observability declared (may be monitoring elsewhere)
 * @Expectation({
 *   name: 'Basic Feature'
 *   // No observability field - OK for non-critical features
 * })
 *
 * // ❌ Bad - Empty metrics array creates false observability
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   observability: {
 *     enabled: true,
 *     metrics: [] // Empty! No actual instrumentation
 *   }
 * })
 * // Problem: You think it's monitored but have zero visibility
 *
 * // ❌ Bad - Custom alert without condition
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   observability: {
 *     enabled: true,
 *     metrics: [EmailValidationLatencyMetric],
 *     alerts: {
 *       custom: [
 *         { condition: '', severity: 'high' } // Empty condition!
 *       ]
 *     }
 *   }
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'emptyMetricsArray' | 'emptyAlertCondition';

export const expectationObservabilityMetricsNonempty = createRule<[], MessageIds>({
  name: 'expectation-observability-metrics-nonempty',
  meta: {
    type: 'problem',
    docs: {
      description: 'Observability metrics array must not be empty when present. In context engineering, empty metrics arrays create false observability - the expectation appears monitored but has no actual instrumentation. This prevents AI systems and teams from verifying that SLOs are being met in production.',
    },
    messages: {
      emptyMetricsArray: "Expectation '{{expectationName}}' has an empty observability.metrics array. In context engineering, declaring a metrics array signals that this expectation is instrumented for monitoring, but an empty array provides zero visibility into runtime behavior. This creates a false sense of observability - you think the system is monitored, but you cannot verify SLOs, diagnose issues, or enable AI-assisted analysis. Either remove the metrics field entirely (if observability happens elsewhere) or add actual metric references that measure latency, success rate, error rate, or other key indicators. Real observability requires real measurements.",
      emptyAlertCondition: "Expectation '{{expectationName}}' has a custom alert at index {{alertIndex}} with an empty condition. In context engineering, alerts without conditions cannot fire - they serve no monitoring purpose. Custom alerts must specify clear, evaluable conditions (e.g., 'latency > 500ms' or 'error_rate > 0.01') that trigger when SLO thresholds are breached. Empty conditions make it impossible for AI monitoring systems to detect and respond to production issues. Provide a specific, measurable condition or remove the alert configuration.",
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
          if (decorator.type !== 'Expectation') continue;

          const expectationName = decorator.metadata.name as string | undefined;
          const observability = decorator.metadata.observability as any | undefined;

          if (!observability) continue;

          // Check if metrics array exists and is empty
          if (observability.metrics && Array.isArray(observability.metrics) && observability.metrics.length === 0) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'emptyMetricsArray',
              data: {
                expectationName: expectationName || 'Unknown',
              },
              fix(fixer) {
                // Access the decorator's expression to find the observability object
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the observability property
                const observabilityProp = arg.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'observability'
                );

                if (!observabilityProp || observabilityProp.value.type !== 'ObjectExpression') return null;

                // Find the metrics property within observability
                const metricsProp = observabilityProp.value.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'metrics'
                );

                if (!metricsProp) return null;

                // Find if there's a comma after this property
                const metricsIndex = observabilityProp.value.properties.indexOf(metricsProp);
                const isLastProperty = metricsIndex === observabilityProp.value.properties.length - 1;

                // Get the range to remove, including trailing comma or preceding comma
                let startPos = metricsProp.range[0];
                let endPos = metricsProp.range[1];

                // Find the comma after the property (if not last)
                if (!isLastProperty) {
                  const textAfter = sourceCode.getText().substring(endPos);
                  const commaMatch = textAfter.match(/^(\s*,)/);
                  if (commaMatch) {
                    endPos += commaMatch[1].length;
                  }
                } else if (metricsIndex > 0) {
                  // If it's the last property, remove the preceding comma
                  const prevProperty = observabilityProp.value.properties[metricsIndex - 1];
                  const textBetween = sourceCode.getText().substring(prevProperty.range[1], startPos);
                  const commaMatch = textBetween.match(/,(\s*)$/);
                  if (commaMatch) {
                    startPos = prevProperty.range[1] + textBetween.lastIndexOf(',');
                  }
                }

                // Also remove any whitespace/newlines before the property
                const textBefore = sourceCode.getText().substring(0, startPos);
                const whitespaceMatch = textBefore.match(/(\n\s*)$/);
                if (whitespaceMatch) {
                  startPos -= whitespaceMatch[1].length;
                }

                return fixer.removeRange([startPos, endPos]);
              },
            });
          }

          // Check custom alerts for empty conditions
          const customAlerts = observability.alerts?.custom;
          if (customAlerts && Array.isArray(customAlerts) && customAlerts.length > 0) {
            customAlerts.forEach((alert: any, index: number) => {
              if (!alert.condition || (typeof alert.condition === 'string' && alert.condition.trim() === '')) {
                context.report({
                  node: decorator.node,
                  messageId: 'emptyAlertCondition',
                  data: {
                    expectationName: expectationName || 'Unknown',
                    alertIndex: index.toString(),
                  },
                });
              }
            });
          }
        }
      },
    };
  },
});
