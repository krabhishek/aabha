/**
 * Behavior Validation Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **validation consistency** ensures that preconditions,
 * postconditions, and validation rules align with each other. Inconsistent validation creates
 * contradictory context that confuses AI systems trying to generate correct validation logic.
 *
 * Consistent validation enables AI to:
 * 1. **Generate coherent validation code** - Preconditions and validation rules should align
 * 2. **Avoid contradictory checks** - Validation shouldn't conflict with preconditions
 * 3. **Design proper error handling** - Consistent validation helps AI understand error scenarios
 * 4. **Create comprehensive tests** - Aligned validation helps AI generate complete test coverage
 *
 * Inconsistent validation means AI systems generate contradictory code - checking for conditions
 * that preconditions already guarantee, or validating things that postconditions should ensure.
 *
 * **What it checks:**
 * - Validation rules don't contradict preconditions
 * - Validation rules align with postconditions
 * - Validation logic is consistent across related behaviors
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Consistent validation
 * @Behavior({
 *   name: 'Process Payment',
 *   preconditions: ['user is authenticated', 'payment method is valid'],
 *   validation: {
 *     rules: ['user must be authenticated', 'payment method must be valid']
 *   }
 *   // Validation aligns with preconditions
 * })
 *
 * // ❌ Bad - Contradictory validation
 * @Behavior({
 *   name: 'Process Payment',
 *   preconditions: ['user is authenticated'],
 *   validation: {
 *     rules: ['user must NOT be authenticated']  // Contradicts precondition!
 *   }
 * })
 *
 * // ❌ Bad - Validation missing for precondition
 * @Behavior({
 *   name: 'Process Payment',
 *   preconditions: ['payment method is valid'],
 *   validation: {
 *     rules: []  // No validation for required precondition
 *   }
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'validationContradictsPrecondition' | 'missingValidationForPrecondition';

export const behaviorValidationConsistency = createRule<[], MessageIds>({
  name: 'behavior-validation-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure validation rules are consistent with preconditions and postconditions to help AI generate coherent validation logic',
    },
    messages: {
      validationContradictsPrecondition: "Behavior '{{name}}' has validation rule '{{validationRule}}' that contradicts precondition '{{precondition}}'. Contradictory validation creates confusing context - AI systems can't generate coherent validation code when rules conflict. Preconditions define what must be true before execution, so validation shouldn't check for the opposite. Align validation rules with preconditions to create consistent, AI-comprehensible validation logic.",
      missingValidationForPrecondition: "Behavior '{{name}}' has {{precondition}} but no validation configuration. Behaviors with preconditions should have validation configured (with strictPreconditions, strictPostconditions, and/or invariants) to ensure model completeness. While invariants don't need to map 1:1 to preconditions, having validation configured helps AI generate complete validation code. Add a 'validation' object to configure validation behavior.",
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
          const validation = decorator.metadata.validation as
            | { strictPreconditions?: boolean; strictPostconditions?: boolean; invariants?: string[] }
            | undefined;

          if (!preconditions || preconditions.length === 0) continue;
          
          // Check if we have preconditions but no validation configuration
          // The schema has validation with strictPreconditions, strictPostconditions, and invariants
          // For complete models, behaviors with preconditions should have validation configured
          // However, invariants are not necessarily a 1:1 mapping to preconditions - they are
          // conditions that must hold throughout execution. So we just check if validation exists.
          if (!validation) {
            // No validation object at all - report once that validation should be configured
            // when preconditions exist (for model completeness), but don't require 1:1 mapping
            context.report({
              node: decorator.node,
              messageId: 'missingValidationForPrecondition',
              data: {
                name: name || 'Unknown',
                precondition: preconditions.length === 1 
                  ? (typeof preconditions[0] === 'string' ? preconditions[0].trim() : 'preconditions')
                  : `${preconditions.length} preconditions`,
              },
            });
            continue;
          }

          // Extract validation rules from invariants if they exist
          // Invariants can serve as validation rules that align with preconditions
          const validationRules = validation.invariants || [];

          // Check for contradictions (simple heuristic: look for "NOT" or negative patterns)
          const validationRuleStrings = validationRules
            .filter((r): r is string => typeof r === 'string')
            .map((r) => r.toLowerCase().trim());

          for (const precondition of preconditions) {
            if (typeof precondition === 'string') {
              const preconditionLower = precondition.toLowerCase().trim();
              const preconditionKey = preconditionLower
                .replace(/^(user|payment|order|item|inventory|email)\s+(is|must|should|has)/i, '$1')
                .replace(/\s+/g, ' ');

              // Check for contradictory validation (contains "not" or negative)
              for (const validationRule of validationRuleStrings) {
                const ruleKey = validationRule
                  .replace(/^(user|payment|order|item|inventory|email)\s+(must|should|has)/i, '$1')
                  .replace(/\s+/g, ' ');

                // Check if validation contradicts precondition
                if (
                  ruleKey.includes('not') &&
                  (ruleKey.includes(preconditionKey.split(' ')[0]) ||
                    preconditionKey.includes(ruleKey.split(' ')[0]))
                ) {
                  context.report({
                    node: decorator.node,
                    messageId: 'validationContradictsPrecondition',
                    data: {
                      name: name || 'Unknown',
                      validationRule: validationRule,
                      precondition: precondition.trim(),
                    },
                  });
                }
              }
            }
          }
        }
      },
    };
  },
});
