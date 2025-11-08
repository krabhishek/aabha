/**
 * Behavior Description Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **description** provides a human-readable explanation
 * of what expected behavior should do. Behaviors model expected behavior (not implementation logic)
 * that would be implemented in a product or business process. Descriptions help teams understand
 * the expected behavior, enable AI systems to generate appropriate implementations, and improve
 * behavior discoverability. Without descriptions, behaviors lack context and teams may misunderstand
 * what is expected.
 *
 * Description enables AI to:
 * 1. **Understand expected behavior** - Know what the behavior should accomplish
 * 2. **Generate implementations** - Create appropriate code or process implementations
 * 3. **Improve discoverability** - Help teams find relevant behaviors
 * 4. **Enable communication** - Help teams communicate expected behavior to stakeholders
 *
 * **What it checks:**
 * - Behavior has `description` field defined
 * - Description is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Behavior({
 *   name: 'Validate Email Format',
 *   description: 'Validates email format and DNS records according to RFC 5322'
 * })
 *
 * // ❌ Bad - Missing description
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing description - what is the expected behavior?
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const behaviorDescriptionRequired = createRule<[], MessageIds>({
  name: 'behavior-description-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have description field. Description provides a human-readable explanation of what expected behavior should do, helping teams understand expected behavior and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingDescription:
        "Behavior '{{name}}' is missing a 'description' field. Description provides a human-readable explanation of what expected behavior should do. Behaviors model expected behavior (not implementation logic) that would be implemented in a product or business process. Descriptions help teams understand the expected behavior, enable AI systems to generate appropriate implementations, and improve behavior discoverability. Add a description field (e.g., 'description: \"Validates email format and DNS records according to RFC 5322\"').",
      emptyDescription:
        "Behavior '{{name}}' has a description field but it's empty. Description should be meaningful and explain what the expected behavior should accomplish. Add a meaningful description.",
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
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                const descriptionTemplate = needsComma
                  ? `,\n  description: '',  // TODO: Human-readable explanation of what this expected behavior should accomplish`
                  : `\n  description: '',  // TODO: Human-readable explanation of what this expected behavior should accomplish`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  descriptionTemplate,
                );
              },
            });
            continue;
          }

          // Check if description is empty
          if (typeof description === 'string' && description.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDescription',
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

