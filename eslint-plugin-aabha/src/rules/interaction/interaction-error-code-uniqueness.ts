/**
 * Interaction Error Code Uniqueness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, error codes must be unique within an interaction
 * to enable AI systems and developers to identify specific failure conditions. Duplicate error
 * codes create ambiguity - when an error occurs, you can't determine which specific failure
 * happened.
 *
 * Duplicate error codes cause:
 * - **Ambiguous error handling** - Cannot distinguish between different failures
 * - **Debugging confusion** - Error logs become unclear
 * - **AI monitoring gaps** - AI cannot accurately track failure patterns
 * - **Documentation conflicts** - Same code maps to multiple scenarios
 *
 * Unique error codes enable:
 * 1. **Clear error identification** - Each error code maps to exactly one failure scenario
 * 2. **Precise monitoring** - AI can track specific error patterns
 * 3. **Better debugging** - Developers immediately know what failed
 * 4. **Consistent documentation** - One code = one meaning
 * 5. **Automated remediation** - AI can trigger specific fixes for specific codes
 *
 * **What it checks:**
 * - Error codes in errorHandling.errorCodes are unique within the interaction
 * - No duplicate error code strings
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Unique error codes
 * @Interaction({
 *   name: 'Account Creation API',
 *   errorHandling: {
 *     errorCodes: [
 *       { code: 'INVALID_EMAIL', description: 'Email format invalid', severity: 'medium', retryable: false },
 *       { code: 'DUPLICATE_ACCOUNT', description: 'Account already exists', severity: 'medium', retryable: false },
 *       { code: 'SERVICE_TIMEOUT', description: 'External service timeout', severity: 'high', retryable: true }
 *     ]
 *   }
 * })
 *
 * // ❌ Bad - Duplicate error code
 * @Interaction({
 *   errorHandling: {
 *     errorCodes: [
 *       { code: 'INVALID_INPUT', description: 'Email format invalid', severity: 'medium', retryable: false },
 *       { code: 'INVALID_INPUT', description: 'Phone format invalid', severity: 'medium', retryable: false }
 *       // ^ Same code for different scenarios - ambiguous!
 *     ]
 *   }
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'duplicateErrorCode';

export const interactionErrorCodeUniqueness = createRule<[], MessageIds>({
  name: 'interaction-error-code-uniqueness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Error codes in errorHandling.errorCodes must be unique. In context engineering, duplicate error codes create ambiguity in error handling, debugging, and AI monitoring.',
    },
    messages: {
      duplicateErrorCode: "Interaction '{{interactionName}}' has duplicate error code '{{errorCode}}' (appears {{count}} times). In context engineering, error codes must be unique to enable precise error identification, AI monitoring, and automated remediation. Each error code should map to exactly one failure scenario. Use distinct codes like 'INVALID_EMAIL' and 'INVALID_PHONE' instead of reusing 'INVALID_INPUT'.",
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
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const errorHandling = decorator.metadata.errorHandling as {
            errorCodes?: Array<{
              code: string;
              description: string;
              severity: string;
              retryable: boolean;
            }>;
          } | undefined;

          if (!errorHandling?.errorCodes || !Array.isArray(errorHandling.errorCodes)) continue;

          // Count occurrences of each error code
          const codeCount = new Map<string, number>();
          for (const errorCode of errorHandling.errorCodes) {
            if (errorCode.code) {
              codeCount.set(errorCode.code, (codeCount.get(errorCode.code) || 0) + 1);
            }
          }

          // Report duplicates
          for (const [code, count] of codeCount.entries()) {
            if (count > 1) {
              context.report({
                node: decorator.node,
                messageId: 'duplicateErrorCode',
                data: {
                  interactionName: interactionName || 'Unknown',
                  errorCode: code,
                  count: count.toString(),
                },
              });
            }
          }
        }
      },
    };
  },
});
