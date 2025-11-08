/**
 * Expectation Observability Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **observability** defines metrics, alerting, and
 * audit trail requirements for tracking expectation fulfillment in production. Observability is
 * essential for production expectations - it enables teams to verify that expectations are being
 * met, detect issues proactively, and maintain compliance through audit trails. Without observability,
 * expectations cannot be monitored or validated in runtime.
 *
 * Observability enables AI to:
 * 1. **Track fulfillment** - Metrics measure if expectations are being met
 * 2. **Detect issues** - Alerts notify stakeholders when expectations fail or SLOs are breached
 * 3. **Enable diagnosis** - Metric data enables AI-assisted root cause analysis
 * 4. **Maintain compliance** - Audit trails provide regulatory compliance records
 *
 * Missing observability makes it impossible to monitor expectation fulfillment or detect issues
 * in production.
 *
 * **What it checks:**
 * - Expectation has `observability` field defined (recommended for production expectations)
 * - Observability should include metrics when enabled
 * - Observability should include alerts for critical expectations
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has observability configuration
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   observability: {
 *     enabled: true,
 *     metrics: [EmailValidationSuccessRateMetric, EmailValidationLatencyMetric],
 *     alerts: {
 *       onSLOBreach: {
 *         severity: 'high',
 *         notifyStakeholders: [EngineeringLeadStakeholder],
 *         channel: 'slack'
 *       }
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing observability configuration
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing observability - cannot monitor expectation fulfillment
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingObservability';

export const expectationObservabilityRecommended = createRule<[], MessageIds>({
  name: 'expectation-observability-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have observability field. Observability defines metrics, alerting, and audit trail requirements for tracking expectation fulfillment in production.',
    },
    messages: {
      missingObservability:
        "Expectation '{{name}}' is missing an 'observability' field. Observability enables monitoring expectation fulfillment in production through metrics, alerts, and audit trails. Consider adding observability configuration (e.g., 'observability: { enabled: true, metrics: [SuccessRateMetric], alerts: { onSLOBreach: { severity: \"high\", notifyStakeholders: [...] } } }').",
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

          const name = decorator.metadata.name as string | undefined;
          const observability = decorator.metadata.observability;

          // Check if observability is missing
          if (!observability) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if observability already exists in source to avoid duplicates
            if (source.includes('observability:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingObservability',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if observability already exists in source to avoid duplicates
                if (source.includes('observability:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const observabilityTemplate = needsComma
                  ? `,\n  observability: {\n    enabled: true,\n    metrics: [],  // TODO: Add metrics for tracking expectation fulfillment\n    alerts: {\n      onSLOBreach: {\n        severity: 'high',\n        notifyStakeholders: [],  // TODO: Add stakeholders to notify\n        channel: 'slack'\n      }\n    }\n  },  // TODO: Configure metrics, alerts, and audit trail`
                  : `\n  observability: {\n    enabled: true,\n    metrics: [],  // TODO: Add metrics for tracking expectation fulfillment\n    alerts: {\n      onSLOBreach: {\n        severity: 'high',\n        notifyStakeholders: [],  // TODO: Add stakeholders to notify\n        channel: 'slack'\n      }\n    }\n  },  // TODO: Configure metrics, alerts, and audit trail`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  observabilityTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

