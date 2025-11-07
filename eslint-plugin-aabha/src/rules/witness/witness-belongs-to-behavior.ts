/**
 * Witness Belongs To Behavior Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witnesses** are verification tests that prove behaviors work
 * correctly. Witnesses are meaningless without behaviors - they must exist within @Behavior classes
 * to have context and purpose. A witness without a behavior is like a test without code to test.
 *
 * This architectural constraint enables:
 * 1. **Clear ownership** - Witnesses belong to specific behaviors, making test organization clear
 * 2. **Context understanding** - AI systems can understand what code the witness is testing
 * 3. **Test generation** - AI can generate test runners that group witnesses by behavior
 * 4. **Documentation clarity** - Test documentation can reference the behavior being verified
 *
 * Witnesses outside @Behavior classes create orphaned tests that AI can't properly organize.
 *
 * **What it checks:**
 * - Methods decorated with @Witness are inside classes decorated with @Behavior
 * - Witness decorators are only used on methods within @Behavior classes
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Witness inside Behavior
 * @Behavior({
 *   name: 'Validate Email Format',
 *   participants: [EmailValidationServiceStakeholder]
 * })
 * export class ValidateEmailFormatBehavior {
 *   @Witness({
 *     name: 'Valid Email Test',
 *     type: WitnessType.Unit,
 *     given: ['Email address is provided'],
 *     when: ['Validation executes'],
 *     then: ['Returns true']
 *   })
 *   witnessValidEmail() {}
 * }
 *
 * // ❌ Bad - Witness outside Behavior
 * export class SomeClass {
 *   @Witness({
 *     name: 'Valid Email Test',
 *     type: WitnessType.Unit
 *   })
 *   witnessValidEmail() {}  // Error: Witness must be inside @Behavior class
 * }
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator, getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'witnessOutsideBehavior';

export const witnessBelongsToBehavior = createRule<[], MessageIds>({
  name: 'witness-belongs-to-behavior',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness decorators must be applied to methods within @Behavior classes. Witnesses prove behaviors work correctly and require behavioral context.',
    },
    messages: {
      witnessOutsideBehavior: "Witness '{{name}}' is not inside a @Behavior class. Witnesses are verification tests that prove behaviors work correctly - they must exist within @Behavior classes to have context and purpose. Move this method into a class decorated with @Behavior, or remove the @Witness decorator if this is not a behavioral test.",
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
        let hasWitness = false;
        let witnessName: string | undefined;

        for (const decorator of node.decorators) {
          const parsed = parseAabhaDecorator(decorator);
          if (parsed && parsed.type === 'Witness') {
            hasWitness = true;
            witnessName = parsed.metadata.name as string | undefined;
            break;
          }
        }

        if (!hasWitness) return;

        // Find the parent class
        let parentClass: TSESTree.ClassDeclaration | null = null;
        let currentNode: TSESTree.Node | undefined = node.parent;

        while (currentNode) {
          if (currentNode.type === 'ClassDeclaration') {
            parentClass = currentNode;
            break;
          }
          currentNode = currentNode.parent;
        }

        if (!parentClass) return;

        // Check if parent class has @Behavior decorator
        const classDecorators = getAabhaDecorators(parentClass);
        const hasBehavior = classDecorators.some(d => d.type === 'Behavior');

        if (!hasBehavior) {
          context.report({
            node: node.decorators.find(d => {
              const parsed = parseAabhaDecorator(d);
              return parsed && parsed.type === 'Witness';
            }) || node,
            messageId: 'witnessOutsideBehavior',
            data: {
              name: witnessName || 'Unnamed witness',
            },
          });
        }
      },
    };
  },
});
