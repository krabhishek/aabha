/**
 * Interaction Backend Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **backendConfig** provides backend-specific configuration
 * for service interactions. For Backend and External layer interactions, backendConfig is essential
 * for understanding service mesh, resilience patterns, caching, and other backend-specific details.
 *
 * Backend config enables AI to:
 * 1. **Understand resilience patterns** - Know circuit breakers, retries, rate limiting
 * 2. **Generate resilient code** - Create appropriate resilience implementations
 * 3. **Plan caching** - Understand caching strategies and TTLs
 * 4. **Enable service mesh** - Know service mesh configuration
 *
 * Missing backendConfig makes it harder to understand backend requirements or generate
 * proper resilient code for Backend/External interactions.
 *
 * **What it checks:**
 * - Backend or External layer interactions should have `backendConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has backend config
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   backendConfig: {
 *     resilience: {
 *       circuitBreaker: { enabled: true, failureThreshold: 5 },
 *       rateLimit: { enabled: true, requestsPerSecond: 100 }
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing backend config for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing backendConfig - unclear resilience requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingBackendConfig';

export const interactionBackendConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-backend-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend and External layer interactions should have backendConfig field. Backend config provides backend-specific configuration for service interactions.',
    },
    messages: {
      missingBackendConfig:
        "Interaction '{{name}}' with layer '{{layer}}' is missing a 'backendConfig' field. Backend config is recommended for Backend and External layer interactions to define service mesh, resilience patterns, caching, and other backend-specific details. Consider adding backend config (e.g., 'backendConfig: { resilience: { circuitBreaker: { enabled: true } } }').",
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
          const backendConfig = decorator.metadata.backendConfig;

          // Only check for Backend or External layers
          if (layer !== 'Backend' && layer !== 'External') continue;

          // Check if backendConfig is missing
          if (!backendConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if backendConfig already exists in source to avoid duplicates
            if (source.includes('backendConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingBackendConfig',
              data: {
                name: name || 'Unnamed interaction',
                layer: layer || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if backendConfig already exists in source to avoid duplicates
                if (source.includes('backendConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const backendConfigTemplate = needsComma
                  ? `,\n  backendConfig: {\n    resilience: {\n      circuitBreaker: { enabled: true, failureThreshold: 5 },\n      rateLimit: { enabled: true, requestsPerSecond: 100 }\n    }\n  },  // TODO: Define backend configuration (resilience, caching, service mesh)`
                  : `\n  backendConfig: {\n    resilience: {\n      circuitBreaker: { enabled: true, failureThreshold: 5 },\n      rateLimit: { enabled: true, requestsPerSecond: 100 }\n    }\n  },  // TODO: Define backend configuration (resilience, caching, service mesh)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  backendConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

