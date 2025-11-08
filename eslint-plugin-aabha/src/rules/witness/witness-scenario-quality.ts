/**
 * Witness Scenario Quality Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **scenario quality** ensures that witness scenarios are
 * meaningful and descriptive. Scenarios that are too short, vague, or empty don't provide
 * enough context for AI systems to understand test purpose or generate documentation.
 *
 * Scenario quality enables AI to:
 * 1. **Understand test purpose** - Know what business scenario is being tested
 * 2. **Generate documentation** - Create test documentation from scenarios
 * 3. **Trace to requirements** - Link scenarios to business requirements
 * 4. **Improve test clarity** - Make test intent clear to developers and AI
 *
 * Poor scenario quality means AI can't understand test purpose or generate meaningful documentation.
 *
 * **What it checks:**
 * - Witness scenarios are not empty
 * - Scenarios are at least 10 characters (meaningful description)
 * - Scenarios avoid vague terms like "test", "check", "verify"
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Quality scenario
 * @Witness({
 *   name: 'Payment Processing Test',
 *   scenario: 'User successfully completes payment with valid credit card'
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Poor scenario quality
 * @Witness({
 *   name: 'Payment Processing Test',
 *   scenario: 'test'  // Too vague, not descriptive
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

const VAGUE_SCENARIO_TERMS = ['test', 'check', 'verify', 'validate', 'ensure'];

type MessageIds = 'missingScenario' | 'scenarioTooShort' | 'scenarioTooVague';

export const witnessScenarioQuality = createRule<[], MessageIds>({
  name: 'witness-scenario-quality',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness scenarios should be meaningful and descriptive to enable AI comprehension and documentation generation',
    },
    messages: {
      missingScenario: "Witness '{{name}}' is missing a 'scenario' field. Scenarios provide high-level test context in plain language and help AI systems understand test purpose and generate documentation. Add a scenario field (e.g., 'scenario: \"User successfully completes payment with valid credit card\"').",
      scenarioTooShort: "Witness '{{name}}' has a scenario that is too short ({{length}} characters). Scenarios should be at least 10 characters to provide meaningful context. Write a descriptive scenario that explains the business context being tested (e.g., 'User successfully completes payment with valid credit card' instead of 'test').",
      scenarioTooVague: "Witness '{{name}}' has a vague scenario '{{scenario}}'. Scenarios should be specific and descriptive, avoiding generic terms like 'test', 'check', or 'verify'. Write a scenario that describes the specific business situation being tested (e.g., 'User successfully completes payment with valid credit card').",
    },
    schema: [],
    fixable: 'code',
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
          const scenario = parsed.metadata.scenario as string | undefined;

          if (!scenario) {
            const sourceCode = context.sourceCode;
            
            context.report({
              node: decorator,
              messageId: 'missingScenario',
              data: { name: name || 'Unnamed witness' },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.expression.type !== 'CallExpression') return null;

                const arg = decorator.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the name property to insert scenario after it
                const nameProperty = arg.properties.find(
                  (p): p is TSESTree.Property =>
                    p.type === 'Property' &&
                    p.key.type === 'Identifier' &&
                    p.key.name === 'name'
                );

                if (!nameProperty) return null;

                const indentation = detectIndentation(nameProperty, sourceCode);
                const insertPosition = nameProperty.range[1];

                // Generate a scenario based on the witness name
                const scenarioText = name 
                  ? name.replace(/^Test\s+/i, '').replace(/\s+/g, ' ').trim()
                  : 'TODO: Describe the test scenario';

                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}scenario: '${scenarioText}',  // TODO: Provide a descriptive scenario`
                );
              },
            });
            continue;
          }

          if (scenario.length < 10) {
            context.report({
              node: decorator,
              messageId: 'scenarioTooShort',
              data: {
                name: name || 'Unnamed witness',
                length: scenario.length,
              },
            });
          }

          const scenarioLower = scenario.toLowerCase();
          for (const vagueTerm of VAGUE_SCENARIO_TERMS) {
            if (scenarioLower === vagueTerm || scenarioLower.trim() === vagueTerm) {
              context.report({
                node: decorator,
                messageId: 'scenarioTooVague',
                data: {
                  name: name || 'Unnamed witness',
                  scenario,
                },
              });
              break;
            }
          }
        }
      },
    };
  },
});
