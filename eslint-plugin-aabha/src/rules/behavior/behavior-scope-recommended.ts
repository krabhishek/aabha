/**
 * Behavior Scope Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **scope** defines the execution boundary and composition
 * level of a behavior (Atomic, Composite, Workflow). Behaviors model expected behavior that would be
 * implemented in a product or business process, and scope helps teams understand behavior boundaries,
 * enables AI systems to generate appropriate implementations with proper scope awareness, and supports
 * behavior modeling. While not always required, scope is important for understanding behavior structure.
 *
 * Scope enables AI to:
 * 1. **Understand behavior boundaries** - Know the execution boundary and composition level
 * 2. **Generate implementations** - Create appropriate code with scope awareness
 * 3. **Model composition** - Understand how behaviors compose together
 * 4. **Plan architecture** - Design appropriate behavior structure
 *
 * **What it checks:**
 * - Behavior should have `scope` field (recommended, not required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has scope
 * @Behavior({
 *   name: 'Validate Email Format',
 *   scope: BehaviorScope.Atomic
 * })
 *
 * // ⚠️ Warning - Missing scope (recommended)
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing scope - consider defining execution boundary
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { addImportsIfMissing } from '../../utils/import-helpers.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingScope';

export const behaviorScopeRecommended = createRule<[], MessageIds>({
  name: 'behavior-scope-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have scope field. Scope defines the execution boundary and composition level, helping teams understand behavior boundaries and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingScope:
        "Behavior '{{name}}' is missing a 'scope' field. Scope defines the execution boundary and composition level of a behavior (Atomic, Composite, Workflow). Behaviors model expected behavior that would be implemented in a product or business process, and scope helps teams understand behavior boundaries, enables AI systems to generate appropriate implementations with proper scope awareness, and supports behavior modeling. Add a scope field (e.g., 'scope: BehaviorScope.Atomic' for single operations, 'scope: BehaviorScope.Composite' for orchestrated behaviors, 'scope: BehaviorScope.Workflow' for end-to-end processes).",
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
          const scope = decorator.metadata.scope;

          // Check if scope is missing (recommended, not required)
          if (!scope) {
            context.report({
              node: decorator.node,
              messageId: 'missingScope',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if scope already exists in source to avoid duplicates
                if (source.includes('scope:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const scopeTemplate = needsComma
                  ? `,\n  scope: BehaviorScope.Atomic,  // TODO: Choose appropriate scope (Atomic, Composite, Workflow)`
                  : `\n  scope: BehaviorScope.Atomic,  // TODO: Choose appropriate scope (Atomic, Composite, Workflow)`;

                // Add import for BehaviorScope if missing
                const importFixes = addImportsIfMissing(
                  fixer,
                  context.sourceCode,
                  node,
                  ['BehaviorScope'],
                  'aabha'
                );

                const fieldFix = fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  scopeTemplate,
                );

                return [...importFixes, fieldFix];
              },
            });
          }
        }
      },
    };
  },
});

