/**
 * Interaction Error Handling Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **errorHandling** defines error codes, fallback strategies,
 * and timeout behavior. For backend, external, and data layer interactions, error handling configuration
 * is essential for understanding how failures are handled and what recovery strategies are in place.
 *
 * Error handling configuration enables AI to:
 * 1. **Understand failure modes** - Know what errors can occur and how they're handled
 * 2. **Generate resilient code** - Create appropriate retry and fallback logic
 * 3. **Plan monitoring** - Understand what errors to track and alert on
 * 4. **Enable debugging** - Know error codes and their meanings
 *
 * Missing error handling configuration makes it harder to understand failure modes or generate
 * proper resilient code for backend/external/data interactions.
 *
 * **What it checks:**
 * - Backend, External, or Data layer interactions should have `errorHandling` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has error handling configuration
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   errorHandling: {
 *     errorCodes: [
 *       { code: 'INVALID_EMAIL', description: 'Email format invalid', severity: 'medium', retryable: false }
 *     ],
 *     fallback: { strategy: 'retry', maxRetries: 3 }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing error handling for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing errorHandling - unclear failure handling
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingErrorHandling';

const ERROR_HANDLING_REQUIRED_LAYERS = ['Backend', 'External', 'Data'];

export const interactionErrorHandlingRecommended = createRule<[], MessageIds>({
  name: 'interaction-error-handling-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend, External, and Data layer interactions should have errorHandling field. Error handling defines error codes, fallback strategies, and timeout behavior.',
    },
    messages: {
      missingErrorHandling:
        "Interaction '{{name}}' with layer '{{layer}}' is missing an 'errorHandling' field. Error handling configuration is recommended for backend, external, and data layer interactions to define error codes, fallback strategies, and timeout behavior. Consider adding error handling configuration (e.g., 'errorHandling: { errorCodes: [...], fallback: { strategy: \"retry\" } }').",
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
          const errorHandling = decorator.metadata.errorHandling;

          // Only check for Backend, External, or Data layers
          if (!layer || !ERROR_HANDLING_REQUIRED_LAYERS.includes(layer)) continue;

          // Check if errorHandling is missing
          if (!errorHandling) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if errorHandling already exists in source to avoid duplicates
            if (source.includes('errorHandling:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingErrorHandling',
              data: {
                name: name || 'Unnamed interaction',
                layer,
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if errorHandling already exists in source to avoid duplicates
                if (source.includes('errorHandling:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const errorHandlingTemplate = needsComma
                  ? `,\n  errorHandling: {\n    errorCodes: [],  // TODO: Define error codes with code, description, severity, retryable\n    fallback: { strategy: 'retry', maxRetries: 3 }  // TODO: Define fallback strategy\n  },  // TODO: Define error handling`
                  : `\n  errorHandling: {\n    errorCodes: [],  // TODO: Define error codes with code, description, severity, retryable\n    fallback: { strategy: 'retry', maxRetries: 3 }  // TODO: Define fallback strategy\n  },  // TODO: Define error handling`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  errorHandlingTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

