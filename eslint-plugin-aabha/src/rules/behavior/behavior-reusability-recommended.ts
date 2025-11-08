/**
 * Behavior Reusability Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **reusability** indicates whether the behavior is intended
 * for single use or reuse across multiple contexts (SingleUse, Reusable, Template). Behaviors model
 * expected behavior that would be implemented in a product or business process, and reusability helps
 * teams understand behavior design intent, enables AI systems to generate appropriate implementations
 * with proper reusability awareness, and supports behavior modeling. While not always required,
 * reusability is important for understanding behavior design.
 *
 * Reusability enables AI to:
 * 1. **Understand design intent** - Know if the expected behavior is designed for reuse
 * 2. **Generate implementations** - Create appropriate code with reusability awareness
 * 3. **Model reuse** - Understand how behaviors can be reused across contexts
 * 4. **Plan architecture** - Design appropriate behavior reuse patterns
 *
 * **What it checks:**
 * - Behavior should have `reusability` field (recommended, not required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has reusability
 * @Behavior({
 *   name: 'Validate Email Format',
 *   reusability: BehaviorReusability.Reusable
 * })
 *
 * // ⚠️ Warning - Missing reusability (recommended)
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing reusability - consider indicating design intent
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { addImportsIfMissing } from '../../utils/import-helpers.js';
import { needsCommaBeforeField } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingReusability';

export const behaviorReusabilityRecommended = createRule<[], MessageIds>({
  name: 'behavior-reusability-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have reusability field. Reusability indicates whether the behavior is designed for reuse, helping teams understand design intent and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingReusability:
        "Behavior '{{name}}' is missing a 'reusability' field. Reusability indicates whether the behavior is intended for single use or reuse across multiple contexts (SingleUse, Reusable, Template). Behaviors model expected behavior that would be implemented in a product or business process, and reusability helps teams understand behavior design intent, enables AI systems to generate appropriate implementations with proper reusability awareness, and supports behavior modeling. Add a reusability field (e.g., 'reusability: BehaviorReusability.Reusable' for general-purpose behaviors, 'reusability: BehaviorReusability.SingleUse' for context-specific behaviors, 'reusability: BehaviorReusability.Template' for abstract patterns).",
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
          const reusability = decorator.metadata.reusability;

          // Check if reusability is missing (recommended, not required)
          if (!reusability) {
            context.report({
              node: decorator.node,
              messageId: 'missingReusability',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if reusability already exists in source to avoid duplicates
                if (source.includes('reusability:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                const reusabilityTemplate = needsComma
                  ? `,\n  reusability: BehaviorReusability.Reusable,  // TODO: Choose appropriate reusability (SingleUse, Reusable, Template)`
                  : `\n  reusability: BehaviorReusability.Reusable,  // TODO: Choose appropriate reusability (SingleUse, Reusable, Template)`;

                // Add import for BehaviorReusability if missing
                const importFixes = addImportsIfMissing(
                  fixer,
                  context.sourceCode,
                  node,
                  ['BehaviorReusability'],
                  'aabha'
                );

                const fieldFix = fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  reusabilityTemplate,
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

