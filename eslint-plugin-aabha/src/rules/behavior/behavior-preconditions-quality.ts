/**
 * Behavior Preconditions Quality Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **preconditions** define what must be true before a
 * behavior can execute. Well-defined preconditions help AI systems generate correct implementations
 * with proper validation, error handling, and guard clauses. Without clear preconditions, AI can't
 * understand the required state, leading to implementations that fail or behave incorrectly.
 *
 * Quality preconditions enable AI to:
 * 1. **Generate validation code** - Preconditions become guard clauses and input validation
 * 2. **Handle errors correctly** - AI knows what to check before execution
 * 3. **Design state management** - Preconditions inform what state must exist
 * 4. **Create test scenarios** - Preconditions help AI generate comprehensive test cases
 *
 * Missing or vague preconditions mean AI systems can't generate proper validation logic or
 * understand when a behavior is safe to execute.
 *
 * **What it checks:**
 * - Behaviors have preconditions defined (when applicable)
 * - Preconditions are meaningful (not empty/whitespace)
 * - Preconditions are specific and testable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear, specific preconditions
 * @Behavior({
 *   name: 'Process Payment',
 *   preconditions: [
 *     'user is authenticated',
 *     'payment method is valid',
 *     'cart total > 0',
 *     'inventory is available for all items'
 *   ]
 * })
 *
 * // ✅ Good - Simple behavior with minimal preconditions
 * @Behavior({
 *   name: 'Validate Email Format',
 *   preconditions: ['email string is provided']
 * })
 *
 * // ❌ Bad - Missing preconditions
 * @Behavior({
 *   name: 'Process Payment'
 *   // What must be true before processing? AI can't generate validation
 * })
 *
 * // ❌ Bad - Vague preconditions
 * @Behavior({
 *   name: 'Process Payment',
 *   preconditions: ['everything is ready']  // Too vague, not testable
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPreconditions' | 'emptyPreconditions' | 'vaguePrecondition';

export const behaviorPreconditionsQuality = createRule<[], MessageIds>({
  name: 'behavior-preconditions-quality',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure behaviors have quality preconditions to help AI generate correct validation and error handling logic',
    },
    messages: {
      missingPreconditions: "Behavior '{{name}}' is missing preconditions - AI systems can't generate proper validation logic without knowing what must be true before execution! In context engineering, preconditions become guard clauses, input validation, and error handling in generated code. Add preconditions that specify the required state, valid inputs, and necessary conditions before this behavior can execute.",
      emptyPreconditions: "Behavior '{{name}}' has empty preconditions array - valuable context is being wasted! Preconditions help AI understand when a behavior is safe to execute and generate appropriate validation code. Add meaningful preconditions that specify required state and conditions.",
      vaguePrecondition: "Behavior '{{name}}' has vague precondition '{{precondition}}'. Preconditions should be specific and testable (e.g., 'user is authenticated', 'cart total > 0') rather than generic statements. Vague preconditions don't help AI generate accurate validation logic. Make preconditions specific and measurable.",
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
          // Only apply to Behavior decorators
          if (decorator.type !== 'Behavior') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const preconditions = decorator.metadata.preconditions as unknown[] | undefined;

          // Check if preconditions are missing
          if (!preconditions) {
            context.report({
              node: decorator.node,
              messageId: 'missingPreconditions',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if preconditions array is empty
          if (preconditions.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyPreconditions',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check for vague preconditions
          const vaguePatterns = [
            /^(everything|all|it|things?)\s+(is|are|should|must)\s+/i,
            /^(ready|ok|valid|good|fine)$/i,
            /^(make sure|ensure|check)\s+(that\s+)?(everything|all|it)/i,
          ];

          for (const precondition of preconditions) {
            if (typeof precondition === 'string') {
              const trimmed = precondition.trim();
              if (trimmed.length < 10) {
                // Very short preconditions are likely vague
                context.report({
                  node: decorator.node,
                  messageId: 'vaguePrecondition',
                  data: {
                    name: name || 'Unknown',
                    precondition: trimmed,
                  },
                });
              } else {
                // Check against vague patterns
                for (const pattern of vaguePatterns) {
                  if (pattern.test(trimmed)) {
                    context.report({
                      node: decorator.node,
                      messageId: 'vaguePrecondition',
                      data: {
                        name: name || 'Unknown',
                        precondition: trimmed,
                      },
                    });
                    break;
                  }
                }
              }
            }
          }
        }
      },
    };
  },
});
