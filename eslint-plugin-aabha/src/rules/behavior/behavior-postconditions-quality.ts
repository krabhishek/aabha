/**
 * Behavior Postconditions Quality Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **postconditions** define what must be true after a
 * behavior executes successfully. Well-defined postconditions help AI systems generate correct
 * implementations with proper state management, return value validation, and outcome verification.
 * Without clear postconditions, AI can't understand the expected outcomes, leading to
 * implementations that don't guarantee the correct final state.
 *
 * Quality postconditions enable AI to:
 * 1. **Generate verification code** - Postconditions become assertions and state validation
 * 2. **Design return values** - AI knows what the behavior should produce
 * 3. **Implement state transitions** - Postconditions inform what state changes must occur
 * 4. **Create test assertions** - Postconditions help AI generate comprehensive test validations
 *
 * Missing or vague postconditions mean AI systems can't generate proper outcome verification or
 * understand what success looks like for a behavior.
 *
 * **What it checks:**
 * - Behaviors have postconditions defined (when applicable)
 * - Postconditions are meaningful (not empty/whitespace)
 * - Postconditions are specific and verifiable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear, specific postconditions
 * @Behavior({
 *   name: 'Process Payment',
 *   postconditions: [
 *     'payment is recorded in database',
 *     'order status is updated to "paid"',
 *     'confirmation email is queued',
 *     'inventory is reserved'
 *   ]
 * })
 *
 * // ✅ Good - Simple behavior with minimal postconditions
 * @Behavior({
 *   name: 'Validate Email Format',
 *   postconditions: ['email format validity is determined and returned']
 * })
 *
 * // ❌ Bad - Missing postconditions
 * @Behavior({
 *   name: 'Process Payment'
 *   // What should be true after processing? AI can't generate verification
 * })
 *
 * // ❌ Bad - Vague postconditions
 * @Behavior({
 *   name: 'Process Payment',
 *   postconditions: ['everything is done']  // Too vague, not verifiable
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPostconditions' | 'emptyPostconditions' | 'vaguePostcondition';

export const behaviorPostconditionsQuality = createRule<[], MessageIds>({
  name: 'behavior-postconditions-quality',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure behaviors have quality postconditions to help AI generate correct outcome verification and state management logic',
    },
    messages: {
      missingPostconditions: "Behavior '{{name}}' is missing postconditions - AI systems can't generate proper outcome verification without knowing what must be true after execution! In context engineering, postconditions become assertions, state validation, and return value checks in generated code. Add postconditions that specify the expected outcomes, state changes, and results after this behavior executes successfully.",
      emptyPostconditions: "Behavior '{{name}}' has empty postconditions array - valuable context is being wasted! Postconditions help AI understand what success looks like and generate appropriate verification code. Add meaningful postconditions that specify expected outcomes and state changes.",
      vaguePostcondition: "Behavior '{{name}}' has vague postcondition '{{postcondition}}'. Postconditions should be specific and verifiable (e.g., 'payment is recorded', 'order status is updated to paid') rather than generic statements. Vague postconditions don't help AI generate accurate verification logic. Make postconditions specific and measurable.",
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
          const postconditions = decorator.metadata.postconditions as unknown[] | undefined;

          // Check if postconditions are missing
          if (!postconditions) {
            context.report({
              node: decorator.node,
              messageId: 'missingPostconditions',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if postconditions array is empty
          if (postconditions.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyPostconditions',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check for vague postconditions
          const vaguePatterns = [
            /^(everything|all|it|things?)\s+(is|are|should|must|done|complete|finished)/i,
            /^(done|complete|finished|ok|good|fine)$/i,
            /^(make sure|ensure|check)\s+(that\s+)?(everything|all|it)/i,
          ];

          for (const postcondition of postconditions) {
            if (typeof postcondition === 'string') {
              const trimmed = postcondition.trim();
              if (trimmed.length < 10) {
                // Very short postconditions are likely vague
                context.report({
                  node: decorator.node,
                  messageId: 'vaguePostcondition',
                  data: {
                    name: name || 'Unknown',
                    postcondition: trimmed,
                  },
                });
              } else {
                // Check against vague patterns
                for (const pattern of vaguePatterns) {
                  if (pattern.test(trimmed)) {
                    context.report({
                      node: decorator.node,
                      messageId: 'vaguePostcondition',
                      data: {
                        name: name || 'Unknown',
                        postcondition: trimmed,
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
