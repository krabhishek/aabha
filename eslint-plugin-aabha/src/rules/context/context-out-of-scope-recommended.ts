/**
 * Context Out of Scope Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **outOfScope** explicitly defines what a context
 * does NOT handle, even if related. Explicit exclusions prevent scope creep and clarify boundaries.
 * While not always required, documenting out-of-scope items is a best practice for clear
 * context boundaries.
 *
 * Out of scope enables AI to:
 * 1. **Prevent scope creep** - Know what the context explicitly does not handle
 * 2. **Clarify boundaries** - Understand context limits and exclusions
 * 3. **Identify integration needs** - Recognize when work requires other contexts
 * 4. **Make informed decisions** - Understand what is explicitly excluded
 *
 * **What it checks:**
 * - Context should have `outOfScope` field (recommended, not required)
 * - When outOfScope is provided, it should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has out of scope
 * @Context({
 *   name: 'Retail Banking',
 *   outOfScope: [
 *     'Credit cards',
 *     'Loans and mortgages',
 *     'Investment products',
 *     'Business banking'
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing out of scope (recommended)
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing outOfScope - consider documenting explicit exclusions
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingOutOfScope' | 'emptyOutOfScope';

export const contextOutOfScopeRecommended = createRule<[], MessageIds>({
  name: 'context-out-of-scope-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have outOfScope field. Out of scope explicitly defines what a context does NOT handle, preventing scope creep and clarifying boundaries.',
    },
    messages: {
      missingOutOfScope:
        "Context '{{name}}' is missing an 'outOfScope' field. Out of scope explicitly defines what this context does NOT handle, even if related. Explicit exclusions prevent scope creep and clarify boundaries. While not always required, documenting out-of-scope items is a best practice. Add an outOfScope array (e.g., 'outOfScope: [\"Credit cards\", \"Loans\", \"Investment products\"]').",
      emptyOutOfScope:
        "Context '{{name}}' has an outOfScope field but it's empty. Out of scope should be meaningful and explicitly define what the context does not handle. Add meaningful out-of-scope items.",
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
          const outOfScope = decorator.metadata.outOfScope as string[] | undefined;

          // Check if outOfScope is missing (recommended, not required)
          if (!outOfScope) {
            context.report({
              node: decorator.node,
              messageId: 'missingOutOfScope',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if outOfScope already exists in source to avoid duplicates
                if (source.includes('outOfScope:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const outOfScopeTemplate = `,\n  outOfScope: [\n    '', // TODO: What this context does NOT handle, even if related\n    '' // TODO: Add more exclusions (e.g., 'Credit cards', 'Loans', 'Investment products')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  outOfScopeTemplate,
                );
              },
            });
            continue;
          }

          // Check if outOfScope is empty
          if (outOfScope.length === 0 || outOfScope.every((o) => typeof o === 'string' && o.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyOutOfScope',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

