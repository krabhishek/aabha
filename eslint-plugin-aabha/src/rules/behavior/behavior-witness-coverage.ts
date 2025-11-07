/**
 * Behavior Witness Coverage Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **witnesses** (tests) validate that behaviors work
 * correctly. Critical and complex behaviors need comprehensive test coverage to ensure they
 * function as expected. Without witness coverage, AI systems can't verify implementations or
 * generate comprehensive test suites.
 *
 * Witness coverage enables AI to:
 * 1. **Generate test suites** - Witnesses help AI understand what to test
 * 2. **Validate implementations** - Coverage ensures behaviors are properly tested
 * 3. **Create regression tests** - Witnesses prevent future breakage
 * 4. **Document expected behavior** - Witnesses serve as executable specifications
 *
 * Missing witness coverage means AI systems can't verify that implementations are correct, and
 * critical behaviors may be deployed without proper validation.
 *
 * **What it checks:**
 * - Critical behaviors should have witness coverage
 * - Complex behaviors should have comprehensive witness coverage
 * - Behaviors with many preconditions/postconditions need corresponding witnesses
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Critical behavior with witness
 * @Behavior({
 *   name: 'Process Payment',
 *   criticality: 'critical'
 * })
 * class ProcessPaymentBehavior {}
 *
 * @Witness({
 *   behavior: ProcessPaymentBehavior,
 *   scenarios: ['happy path', 'insufficient funds', 'network failure']
 * })
 * class ProcessPaymentWitness {}
 *
 * // ⚠️ Warning - Critical behavior without witness
 * @Behavior({
 *   name: 'Process Payment',
 *   criticality: 'critical'
 * })
 * class ProcessPaymentBehavior {}
 * // No witness - critical behavior untested!
 *
 * // ⚠️ Warning - Complex behavior with minimal coverage
 * @Behavior({
 *   name: 'Multi-Step Validation',
 *   complexity: 'complex',
 *   preconditions: ['user authenticated', 'data valid', 'permissions checked'],
 *   postconditions: ['validation complete', 'results recorded', 'notifications sent']
 * })
 * class MultiStepValidationBehavior {}
 *
 * @Witness({
 *   behavior: MultiStepValidationBehavior,
 *   scenarios: ['happy path']  // Only one scenario for complex behavior
 * })
 * class MultiStepValidationWitness {}
 * ```
 *
 * **Note:** This rule checks for witness presence within the same file. Cross-file witness
 * detection requires full project analysis and should be performed in CI/CD pipelines.
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalMissingWitness' | 'complexNeedsMoreWitnesses';

export const behaviorWitnessCoverage = createRule<[], MessageIds>({
  name: 'behavior-witness-coverage',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure critical and complex behaviors have adequate witness (test) coverage to help AI generate comprehensive test suites',
    },
    messages: {
      criticalMissingWitness: "Behavior '{{name}}' is marked 'critical' but has no witness (test) coverage in this file. Critical behaviors need test coverage to ensure they function correctly in production. Without witnesses, AI can't verify implementations or generate comprehensive test suites. Add witness decorators with test scenarios to validate this critical behavior. Cross-file witness detection requires full project analysis.",
      complexNeedsMoreWitnesses: "Behavior '{{name}}' is marked 'complex' with {{requirementCount}} requirements but only has {{witnessCount}} witness scenario(s). Complex behaviors need comprehensive test coverage to validate all preconditions, postconditions, and edge cases. Minimal witness coverage means AI can't generate complete test suites or verify all behavior paths. Add more witness scenarios to cover all requirements and edge cases.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node: TSESTree.Program) {
        const behaviors: Array<{
          name: string;
          criticality?: string;
          complexity?: string;
          requirementCount: number;
          node: TSESTree.Decorator;
        }> = [];
        const witnesses: Array<{
          behaviorName?: string;
          scenarioCount: number;
        }> = [];

        // Collect all behaviors and witnesses in the file
        for (const statement of node.body) {
          if (statement.type === 'ClassDeclaration') {
            const decorators = getAabhaDecorators(statement);
            for (const decorator of decorators) {
              if (decorator.type === 'Behavior') {
                const name = decorator.metadata.name as string | undefined;
                const criticality = decorator.metadata.criticality as string | undefined;
                const complexity = decorator.metadata.complexity as string | undefined;
                const preconditions = decorator.metadata.preconditions as unknown[] | undefined;
                const postconditions = decorator.metadata.postconditions as unknown[] | undefined;
                const requirementCount =
                  (preconditions?.length || 0) + (postconditions?.length || 0);

                behaviors.push({
                  name: name || 'Unknown',
                  criticality,
                  complexity,
                  requirementCount,
                  node: decorator.node,
                });
              } else if (decorator.type === 'Witness') {
                const behavior = decorator.metadata.behavior;
                const scenarios = decorator.metadata.scenarios as unknown[] | undefined;
                const behaviorName =
                  typeof behavior === 'string'
                    ? behavior
                    : (behavior as { name?: string })?.name;

                witnesses.push({
                  behaviorName,
                  scenarioCount: scenarios?.length || 0,
                });
              }
            }
          }
        }

        // Check each behavior for coverage
        for (const behavior of behaviors) {
          // Check critical behaviors
          if (behavior.criticality === 'critical') {
            const hasWitness = witnesses.some(
              (w) => w.behaviorName === behavior.name || w.behaviorName === undefined
            );
            if (!hasWitness) {
              context.report({
                node: behavior.node,
                messageId: 'criticalMissingWitness',
                data: { name: behavior.name },
              });
            }
          }

          // Check complex behaviors
          if (behavior.complexity === 'complex' && behavior.requirementCount > 0) {
            const behaviorWitnesses = witnesses.filter(
              (w) => w.behaviorName === behavior.name || w.behaviorName === undefined
            );
            const totalScenarios = behaviorWitnesses.reduce(
              (sum, w) => sum + w.scenarioCount,
              0
            );

            // Complex behaviors with many requirements should have multiple scenarios
            if (behavior.requirementCount > 3 && totalScenarios < 2) {
              context.report({
                node: behavior.node,
                messageId: 'complexNeedsMoreWitnesses',
                data: {
                  name: behavior.name,
                  requirementCount: behavior.requirementCount.toString(),
                  witnessCount: totalScenarios.toString(),
                },
              });
            }
          }
        }
      },
    };
  },
});
