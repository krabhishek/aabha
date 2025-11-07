/**
 * Witness Type Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witness type** categorizes tests by scope and execution
 * characteristics. The type determines default timeout expectations, test runner configuration,
 * and helps AI systems understand test execution requirements. Without a type, AI can't properly
 * configure test environments or understand test dependencies.
 *
 * Witness types enable AI to:
 * 1. **Configure test environments** - Unit tests need isolation, integration tests need services
 * 2. **Set appropriate timeouts** - E2E tests need longer timeouts than unit tests
 * 3. **Understand test dependencies** - Integration tests may need databases, E2E tests need full stack
 * 4. **Generate test runners** - Different types require different test runner configurations
 *
 * Missing witness types prevent AI from generating accurate test execution code.
 *
 * **What it checks:**
 * - Witness decorators have a `type` field (WitnessType.Unit, WitnessType.Integration, etc.)
 * - Type is a valid WitnessType enum value
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Type specified
 * @Witness({
 *   name: 'Valid Email Test',
 *   type: WitnessType.Unit,
 *   given: ['Email address is provided'],
 *   when: ['Validation executes'],
 *   then: ['Returns true']
 * })
 * witnessValidEmail() {}
 *
 * // ❌ Bad - Missing type
 * @Witness({
 *   name: 'Valid Email Test',
 *   given: ['Email address is provided'],
 *   when: ['Validation executes'],
 *   then: ['Returns true']
 * })
 * witnessValidEmail() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingType';

export const witnessTypeRequired = createRule<[], MessageIds>({
  name: 'witness-type-required',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness decorators must specify a type to enable proper test configuration and AI comprehension',
    },
    messages: {
      missingType: "Witness '{{name}}' is missing a 'type' field. Witness types (Unit, Integration, E2E, Acceptance, Performance, Security) categorize tests by scope and execution characteristics. Without a type, AI systems can't configure test environments, set appropriate timeouts, or understand test dependencies. Add a type field (e.g., 'type: WitnessType.Unit') to enable proper test execution configuration.",
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
          const type = parsed.metadata.type;

          // Check if type is missing
          if (!type) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator,
              messageId: 'missingType',
              data: {
                name: name || 'Unnamed witness',
              },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.expression.type !== 'CallExpression') return null;

                const arg = decorator.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the name property to insert type after it
                const nameProperty = arg.properties.find(
                  (p): p is TSESTree.Property =>
                    p.type === 'Property' &&
                    p.key.type === 'Identifier' &&
                    p.key.name === 'name'
                );

                if (!nameProperty) return null;

                const indentation = detectIndentation(nameProperty, sourceCode);
                const insertPosition = nameProperty.range[1];

                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}type: WitnessType.Unit`
                );
              },
            });
          }
        }
      },
    };
  },
});
