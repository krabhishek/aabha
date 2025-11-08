/**
 * Interaction Observability Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **observability** defines monitoring, logging, tracing,
 * and alerting for interactions. For backend, external, and data layer interactions, observability
 * configuration is essential for understanding system behavior and debugging production issues.
 *
 * Observability configuration enables AI to:
 * 1. **Understand monitoring needs** - Know what metrics, logs, and traces to collect
 * 2. **Generate observability code** - Create appropriate instrumentation
 * 3. **Plan alerting** - Understand what conditions to alert on
 * 4. **Enable debugging** - Know how to trace and debug issues
 *
 * Missing observability configuration makes it harder to understand monitoring needs or generate
 * proper observability code for backend/external/data interactions.
 *
 * **What it checks:**
 * - Backend, External, or Data layer interactions should have `observability` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has observability configuration
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   observability: {
 *     enabled: true,
 *     metrics: [InteractionLatencyMetric, InteractionSuccessRateMetric],
 *     logLevel: 'info',
 *     tracing: { enabled: true }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing observability for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing observability - unclear monitoring needs
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingObservability';

const OBSERVABILITY_REQUIRED_LAYERS = ['Backend', 'External', 'Data'];

export const interactionObservabilityRecommended = createRule<[], MessageIds>({
  name: 'interaction-observability-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend, External, and Data layer interactions should have observability field. Observability defines monitoring, logging, tracing, and alerting for interactions.',
    },
    messages: {
      missingObservability:
        "Interaction '{{name}}' with layer '{{layer}}' is missing an 'observability' field. Observability configuration is recommended for backend, external, and data layer interactions to define monitoring, logging, tracing, and alerting. Consider adding observability configuration (e.g., 'observability: { enabled: true, metrics: [...], logLevel: \"info\", tracing: { enabled: true } }').",
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
          if (decorator.type !== 'Interaction') continue;

          const name = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;
          const observability = decorator.metadata.observability;

          // Only check for Backend, External, or Data layers
          if (!layer || !OBSERVABILITY_REQUIRED_LAYERS.includes(layer)) continue;

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
              data: {
                name: name || 'Unnamed interaction',
                layer,
              },
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
                  ? `,\n  observability: {\n    enabled: true,\n    metrics: [],  // TODO: Add @Metric decorated classes\n    logLevel: 'info',  // TODO: Choose log level (error, warn, info, debug, trace)\n    tracing: { enabled: true }  // TODO: Configure distributed tracing\n  },  // TODO: Define observability`
                  : `\n  observability: {\n    enabled: true,\n    metrics: [],  // TODO: Add @Metric decorated classes\n    logLevel: 'info',  // TODO: Choose log level (error, warn, info, debug, trace)\n    tracing: { enabled: true }  // TODO: Configure distributed tracing\n  },  // TODO: Define observability`;

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

