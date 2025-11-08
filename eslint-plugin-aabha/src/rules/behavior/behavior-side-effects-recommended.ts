/**
 * Behavior Side Effects Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **sideEffects** document changes or impacts that the
 * expected behavior causes beyond its primary purpose. Behaviors model expected behavior that would
 * be implemented in a product or business process, and documenting side effects helps teams understand
 * behavior impact, enables AI systems to generate appropriate implementations with proper side effect
 * handling, and supports behavior modeling. While not always required, side effects are important for
 * understanding behavior impact and dependencies.
 *
 * Side effects enable AI to:
 * 1. **Understand behavior impact** - Know what changes the expected behavior causes
 * 2. **Generate implementations** - Create appropriate code with side effect handling
 * 3. **Model dependencies** - Understand behavior relationships and impacts
 * 4. **Support testing** - Identify side effects for test scenarios
 *
 * **What it checks:**
 * - Behavior should have `sideEffects` field (recommended, not required)
 * - When side effects are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has side effects
 * @Behavior({
 *   name: 'Process Payment',
 *   sideEffects: ['Account balance updated', 'Transaction log created', 'Audit trail recorded']
 * })
 *
 * // ⚠️ Warning - Missing side effects (recommended)
 * @Behavior({
 *   name: 'Process Payment'
 *   // Missing sideEffects - consider documenting behavior impacts
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingSideEffects' | 'emptySideEffects';

export const behaviorSideEffectsRecommended = createRule<[], MessageIds>({
  name: 'behavior-side-effects-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have sideEffects field. Side effects document changes or impacts that the expected behavior causes, helping teams understand behavior impact and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingSideEffects:
        "Behavior '{{name}}' is missing a 'sideEffects' field. Side effects document changes or impacts that the expected behavior causes beyond its primary purpose. Behaviors model expected behavior that would be implemented in a product or business process, and documenting side effects helps teams understand behavior impact, enables AI systems to generate appropriate implementations with proper side effect handling, and supports behavior modeling. Add a sideEffects array (e.g., 'sideEffects: [\"Account balance updated\", \"Transaction log created\"]').",
      emptySideEffects:
        "Behavior '{{name}}' has a sideEffects field but it's empty. Side effects should document changes or impacts that the expected behavior causes. Add meaningful side effects.",
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
          const sideEffects = decorator.metadata.sideEffects as string[] | undefined;

          // Check if sideEffects is missing (recommended, not required)
          if (!sideEffects) {
            context.report({
              node: decorator.node,
              messageId: 'missingSideEffects',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if sideEffects already exists in source to avoid duplicates
                if (source.includes('sideEffects:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                const sideEffectsTemplate = needsComma
                  ? `,\n  sideEffects: [\n    '', // TODO: Changes or impacts that this expected behavior causes (e.g., 'Account balance updated', 'Transaction log created')\n    '' // TODO: Add more side effects\n  ]`
                  : `\n  sideEffects: [\n    '', // TODO: Changes or impacts that this expected behavior causes (e.g., 'Account balance updated', 'Transaction log created')\n    '' // TODO: Add more side effects\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  sideEffectsTemplate,
                );
              },
            });
            continue;
          }

          // Check if sideEffects is empty
          if (sideEffects.length === 0 || sideEffects.every((s) => typeof s === 'string' && s.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptySideEffects',
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

