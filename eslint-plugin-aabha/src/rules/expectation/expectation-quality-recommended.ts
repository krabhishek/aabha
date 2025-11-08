/**
 * Expectation Quality Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **quality** defines Service Level Objectives (SLOs)
 * and Service Level Indicators (SLIs) that measure how well an expectation is being fulfilled.
 * Quality attributes are essential for production expectations - they define measurable targets
 * (latency, availability, throughput) and the metrics that track compliance. Without quality
 * configuration, expectations lack measurable success criteria and cannot be validated in production.
 *
 * Quality enables AI to:
 * 1. **Define success criteria** - SLOs specify measurable targets for expectation fulfillment
 * 2. **Track compliance** - SLIs provide metrics to measure SLO compliance
 * 3. **Enable monitoring** - Quality targets enable alerting and proactive issue detection
 * 4. **Enable optimization** - Historical quality data enables AI-driven performance optimization
 *
 * Missing quality makes it impossible to measure if expectations are being met or to set up
 * proper monitoring and alerting.
 *
 * **What it checks:**
 * - Expectation has `quality` field defined (recommended for production expectations)
 * - Quality should include SLO targets (latency, availability, etc.)
 * - Quality should include SLI metrics when SLOs are defined
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has quality configuration with SLOs and SLIs
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   quality: {
 *     slo: {
 *       latency: { p95: '1s', max: '5s' },
 *       availability: { target: '99.9%', errorBudget: '43m/month' }
 *     },
 *     sli: {
 *       successRate: EmailValidationSuccessRateMetric,
 *       latency: EmailValidationLatencyMetric
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing quality configuration
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing quality - no measurable success criteria
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingQuality';

export const expectationQualityRecommended = createRule<[], MessageIds>({
  name: 'expectation-quality-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have quality field. Quality defines Service Level Objectives (SLOs) and Service Level Indicators (SLIs) that measure expectation fulfillment.',
    },
    messages: {
      missingQuality:
        "Expectation '{{name}}' is missing a 'quality' field. Quality defines measurable success criteria (SLOs) and metrics (SLIs) for tracking expectation fulfillment in production. Consider adding quality configuration with SLO targets (latency, availability) and SLI metrics. Example: quality: { slo: { latency: { p95: '1s' }, availability: { target: '99.9%' } }, sli: { successRate: SuccessRateMetric } }.",
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
          const quality = decorator.metadata.quality;

          // Check if quality is missing
          if (!quality) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if quality already exists in source to avoid duplicates
            if (source.includes('quality:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingQuality',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if quality already exists in source to avoid duplicates
                if (source.includes('quality:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const qualityTemplate = needsComma
                  ? `,\n  quality: {\n    slo: {\n      latency: { p95: '', max: '' },\n      availability: { target: '', errorBudget: '' }\n    },\n    sli: {\n      successRate: undefined,  // TODO: Add success rate metric\n      latency: undefined  // TODO: Add latency metric\n    }\n  },  // TODO: Define SLO targets and SLI metrics`
                  : `\n  quality: {\n    slo: {\n      latency: { p95: '', max: '' },\n      availability: { target: '', errorBudget: '' }\n    },\n    sli: {\n      successRate: undefined,  // TODO: Add success rate metric\n      latency: undefined  // TODO: Add latency metric\n    }\n  },  // TODO: Define SLO targets and SLI metrics`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  qualityTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

