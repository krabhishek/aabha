/**
 * Behavior Validation Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **validation** defines how strictly pre/postconditions
 * are enforced and what invariants must hold throughout execution. When a validation object is provided,
 * it should include meaningful configuration to enable proper contract validation. Incomplete validation
 * objects lack the information needed to understand validation requirements.
 *
 * Validation completeness enables AI to:
 * 1. **Understand validation requirements** - Know how strictly pre/postconditions are enforced
 * 2. **Generate implementations** - Create appropriate code with validation awareness
 * 3. **Enforce contracts** - Understand validation requirements for contract enforcement
 * 4. **Plan testing** - Identify validation requirements for test scenarios
 *
 * **What it checks:**
 * - If validation exists, it should have meaningful configuration (strictPreconditions, strictPostconditions, or invariants)
 * - When invariants are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete validation
 * @Behavior({
 *   name: 'Process Payment',
 *   validation: {
 *     strictPreconditions: true,
 *     strictPostconditions: true,
 *     invariants: ['Account balance >= 0']
 *   }
 * })
 *
 * // ❌ Bad - Incomplete validation
 * @Behavior({
 *   name: 'Process Payment',
 *   validation: {
 *     // Missing strictPreconditions, strictPostconditions, and invariants
 *   }
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteValidation' | 'emptyInvariants';

export const behaviorValidationCompleteness = createRule<[], MessageIds>({
  name: 'behavior-validation-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors with validation field should have complete validation objects. Validation objects should include meaningful configuration to enable proper contract validation.',
    },
    messages: {
      incompleteValidation:
        "Behavior '{{name}}' has validation object but missing key fields. Validation objects should include at least 'strictPreconditions' (boolean), 'strictPostconditions' (boolean), or 'invariants' (array of invariant conditions) to enable proper contract validation. Add validation configuration (e.g., 'strictPreconditions: true' or 'invariants: [\"Account balance >= 0\"]').",
      emptyInvariants:
        "Behavior '{{name}}' has validation with invariants array but it's empty. Invariants should document conditions that must hold throughout execution. Add meaningful invariants.",
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
          if (decorator.type !== 'Behavior') continue;

          const name = decorator.metadata.name as string | undefined;
          const validation = decorator.metadata.validation as
            | {
                strictPreconditions?: boolean;
                strictPostconditions?: boolean;
                invariants?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Only check if validation exists
          if (!validation) continue;

          // Check if validation has at least one meaningful field
          const hasStrictPreconditions = validation.strictPreconditions !== undefined;
          const hasStrictPostconditions = validation.strictPostconditions !== undefined;
          const hasInvariants = validation.invariants && validation.invariants.length > 0;

          if (!hasStrictPreconditions && !hasStrictPostconditions && !hasInvariants) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteValidation',
              data: { name: name || 'Unnamed behavior' },
            });
            continue;
          }

          // Check if invariants array is empty
          if (validation.invariants && validation.invariants.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyInvariants',
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

