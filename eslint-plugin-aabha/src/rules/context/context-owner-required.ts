/**
 * Context Owner Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **owner** identifies the person or role accountable
 * for a context's success and decisions. Clear ownership ensures accountability, enables decision-making,
 * and helps teams know who to contact for context-related questions. Without an owner, contexts lack
 * accountability and decision-making authority.
 *
 * Owner enables AI to:
 * 1. **Identify accountability** - Know who is responsible for context decisions
 * 2. **Route questions** - Direct context-related inquiries to the right person
 * 3. **Track ownership** - Maintain ownership records for organizational charts
 * 4. **Enable governance** - Support governance processes requiring clear ownership
 *
 * **What it checks:**
 * - Context has `owner` field defined
 * - Owner is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has owner
 * @Context({
 *   name: 'Retail Banking',
 *   owner: 'Sarah Johnson'
 * })
 *
 * // ❌ Bad - Missing owner
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing owner
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingOwner' | 'emptyOwner';

export const contextOwnerRequired = createRule<[], MessageIds>({
  name: 'context-owner-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have owner field. Owner identifies the person or role accountable for context success and decisions, ensuring accountability and enabling decision-making.',
    },
    messages: {
      missingOwner:
        "Context '{{name}}' is missing an 'owner' field. Owner identifies the person or role accountable for this context's success and decisions. Clear ownership ensures accountability, enables decision-making, and helps teams know who to contact for context-related questions. Add an owner field (e.g., 'owner: \"Sarah Johnson\"' or 'owner: \"Head of Retail Banking\"').",
      emptyOwner:
        "Context '{{name}}' has an owner field but it's empty. Owner should be meaningful and identify the person or role accountable for context decisions. Add a meaningful owner.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const owner = decorator.metadata.owner as string | undefined;

          // Check if owner is missing
          if (!owner) {
            context.report({
              node: decorator.node,
              messageId: 'missingOwner',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if owner already exists in source to avoid duplicates
                if (source.includes('owner:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const ownerTemplate = `,\n  owner: '',  // TODO: Person or role accountable for this context's success and decisions`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  ownerTemplate,
                );
              },
            });
            continue;
          }

          // Check if owner is empty
          if (typeof owner === 'string' && owner.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyOwner',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

