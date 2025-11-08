/**
 * Interaction Quality Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **quality** defines Service Level Objectives (SLOs) and
 * Service Level Indicators (SLIs) for measuring interaction performance and reliability. For backend,
 * external, and data layer interactions, quality metrics are essential for understanding performance
 * expectations and monitoring production systems.
 *
 * Quality configuration enables AI to:
 * 1. **Understand performance expectations** - Know latency, availability, and throughput targets
 * 2. **Generate monitoring code** - Create appropriate metrics and alerting
 * 3. **Plan capacity** - Understand throughput and burst requirements
 * 4. **Enable observability** - Set up proper SLI tracking
 *
 * Missing quality configuration makes it harder to understand performance expectations or generate
 * proper monitoring code for backend/external/data interactions.
 *
 * **What it checks:**
 * - Backend, External, or Data layer interactions should have `quality` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has quality configuration
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   quality: {
 *     slo: {
 *       latency: { p95: '500ms', p99: '1s' },
 *       availability: { target: '99.9%' }
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing quality for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing quality - unclear performance expectations
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingQuality';

const QUALITY_REQUIRED_LAYERS = ['Backend', 'External', 'Data'];

export const interactionQualityRecommended = createRule<[], MessageIds>({
  name: 'interaction-quality-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend, External, and Data layer interactions should have quality field. Quality defines SLOs and SLIs for measuring interaction performance and reliability.',
    },
    messages: {
      missingQuality:
        "Interaction '{{name}}' with layer '{{layer}}' is missing a 'quality' field. Quality configuration (SLOs/SLIs) is recommended for backend, external, and data layer interactions to define performance expectations and enable monitoring. Consider adding quality configuration (e.g., 'quality: { slo: { latency: { p95: \"500ms\" }, availability: { target: \"99.9%\" } } }').",
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
          const quality = decorator.metadata.quality;

          // Only check for Backend, External, or Data layers
          if (!layer || !QUALITY_REQUIRED_LAYERS.includes(layer)) continue;

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
              data: {
                name: name || 'Unnamed interaction',
                layer,
              },
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
                  ? `,\n  quality: {\n    slo: {\n      latency: { p95: '500ms', p99: '1s' },\n      availability: { target: '99.9%' }\n    }\n  },  // TODO: Define SLOs and SLIs for performance monitoring`
                  : `\n  quality: {\n    slo: {\n      latency: { p95: '500ms', p99: '1s' },\n      availability: { target: '99.9%' }\n    }\n  },  // TODO: Define SLOs and SLIs for performance monitoring`;

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

