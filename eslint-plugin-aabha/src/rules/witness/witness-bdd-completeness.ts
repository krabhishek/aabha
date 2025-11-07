/**
 * Witness BDD Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witnesses** follow BDD (Behavior-Driven Development)
 * conventions using Given-When-Then structure. This structure creates self-documenting tests
 * that AI systems can understand and use to generate test documentation, traceability reports,
 * and test execution plans.
 *
 * BDD structure enables AI to:
 * 1. **Understand test context** - Given conditions explain preconditions
 * 2. **Understand test actions** - When actions describe what's being tested
 * 3. **Understand expected outcomes** - Then assertions define success criteria
 * 4. **Generate documentation** - BDD structure maps directly to test documentation
 * 5. **Trace requirements** - Given-When-Then can be linked to requirements and user stories
 *
 * Incomplete BDD structure means AI can't fully understand test intent or generate accurate documentation.
 *
 * **What it checks:**
 * - Witness has `given` array (preconditions)
 * - Witness has `when` array (test actions)
 * - Witness has `then` array (expected outcomes)
 * - Arrays are not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete BDD structure
 * @Witness({
 *   name: 'Valid Email Test',
 *   type: WitnessType.Unit,
 *   given: ['Email address is provided', 'Email format is valid'],
 *   when: ['Validation executes'],
 *   then: ['Returns true', 'No errors are thrown']
 * })
 * witnessValidEmail() {}
 *
 * // ❌ Bad - Missing BDD elements
 * @Witness({
 *   name: 'Valid Email Test',
 *   type: WitnessType.Unit,
 *   given: ['Email address is provided']
 *   // Missing when and then
 * })
 * witnessValidEmail() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'missingGiven' | 'missingWhen' | 'missingThen' | 'emptyGiven' | 'emptyWhen' | 'emptyThen';

export const witnessBddCompleteness = createRule<[], MessageIds>({
  name: 'witness-bdd-completeness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness decorators should follow complete BDD structure with given, when, and then fields',
    },
    messages: {
      missingGiven: "Witness '{{name}}' is missing a 'given' field. BDD structure requires preconditions (Given) to explain the test context. Add a given array with preconditions (e.g., 'given: [\"User is authenticated\", \"Email address is provided\"]').",
      missingWhen: "Witness '{{name}}' is missing a 'when' field. BDD structure requires test actions (When) to describe what's being tested. Add a when array with test actions (e.g., 'when: [\"Validation executes\", \"System processes request\"]').",
      missingThen: "Witness '{{name}}' is missing a 'then' field. BDD structure requires expected outcomes (Then) to define success criteria. Add a then array with expected outcomes (e.g., 'then: [\"Returns true\", \"No errors are thrown\"]').",
      emptyGiven: "Witness '{{name}}' has an empty 'given' array. BDD structure requires at least one precondition to explain test context. Add preconditions to the given array.",
      emptyWhen: "Witness '{{name}}' has an empty 'when' array. BDD structure requires at least one test action to describe what's being tested. Add test actions to the when array.",
      emptyThen: "Witness '{{name}}' has an empty 'then' array. BDD structure requires at least one expected outcome to define success criteria. Add expected outcomes to the then array.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        // Check if this method has decorators
        if (!node.decorators || node.decorators.length === 0) return;

        // Find @Witness decorator
        for (const decorator of node.decorators) {
          const parsed = parseAabhaDecorator(decorator);
          if (!parsed || parsed.type !== 'Witness') continue;

          const name = parsed.metadata.name as string | undefined;
          const given = parsed.metadata.given;
          const when = parsed.metadata.when;
          const then = parsed.metadata.then;

          if (!given) {
            context.report({
              node: decorator,
              messageId: 'missingGiven',
              data: { name: name || 'Unnamed witness' },
            });
          } else if (Array.isArray(given) && given.length === 0) {
            context.report({
              node: decorator,
              messageId: 'emptyGiven',
              data: { name: name || 'Unnamed witness' },
            });
          }

          if (!when) {
            context.report({
              node: decorator,
              messageId: 'missingWhen',
              data: { name: name || 'Unnamed witness' },
            });
          } else if (Array.isArray(when) && when.length === 0) {
            context.report({
              node: decorator,
              messageId: 'emptyWhen',
              data: { name: name || 'Unnamed witness' },
            });
          }

          if (!then) {
            context.report({
              node: decorator,
              messageId: 'missingThen',
              data: { name: name || 'Unnamed witness' },
            });
          } else if (Array.isArray(then) && then.length === 0) {
            context.report({
              node: decorator,
              messageId: 'emptyThen',
              data: { name: name || 'Unnamed witness' },
            });
          }
        }
      },
    };
  },
});
