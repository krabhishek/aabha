/**
 * Action Description Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **description** provides a human-readable explanation
 * of what an action does, when it happens, and why it matters. Descriptions help teams understand
 * action purpose, enable AI systems to generate documentation, and improve action discoverability.
 * Without descriptions, actions lack context and teams may misunderstand what is being performed.
 *
 * Description enables AI to:
 * 1. **Understand purpose** - Know what the action does and why
 * 2. **Generate documentation** - Create action documentation and guides
 * 3. **Improve discoverability** - Help teams find relevant actions
 * 4. **Enable communication** - Help teams communicate action purpose to stakeholders
 *
 * **What it checks:**
 * - Action has `description` field defined
 * - Description is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Action({
 *   name: 'Email Verified',
 *   description: 'Email verification is complete and customer can proceed to identity verification',
 *   scope: ActionScope.Journey
 * })
 *
 * // ❌ Bad - Missing description
 * @Action({
 *   name: 'Email Verified',
 *   scope: ActionScope.Journey
 *   // Missing description
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const actionDescriptionRequired = createRule<[], MessageIds>({
  name: 'action-description-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions should have description field. Description provides a human-readable explanation of what an action does, when it happens, and why it matters.',
    },
    messages: {
      missingDescription:
        "Action '{{name}}' is missing a 'description' field. Description provides a human-readable explanation of what an action does, when it happens, and why it matters. Descriptions help teams understand action purpose, enable AI systems to generate documentation, and improve action discoverability. Add a description field (e.g., 'description: \"Customer submits the account opening form with email and password\"' for atomic actions, or 'description: \"Email verification is complete and customer can proceed to identity verification\"' for journey actions).",
      emptyDescription:
        "Action '{{name}}' has a description field but it's empty. Description should be meaningful and explain what the action does. Add a meaningful description.",
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
          if (decorator.type !== 'Action') continue;

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const descriptionTemplate = needsComma
                  ? `,\n  description: '',  // TODO: Human-readable explanation of what this action does, when it happens, and why it matters`
                  : `\n  description: '',  // TODO: Human-readable explanation of what this action does, when it happens, and why it matters`;

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
              data: { name: name || 'Unnamed action' },
            });
          }
        }
      },
    };
  },
});

