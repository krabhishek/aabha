/**
 * Action Automation Level Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **automationLevel** specifies who/what performs an action
 * (Manual, SemiAutomated, FullyAutomated, AIAssisted). Automation level helps teams understand action
 * execution, enables AI systems to generate appropriate implementations, and supports workflow planning.
 * While not always required, automation level is important for understanding action execution context.
 *
 * Automation level enables AI to:
 * 1. **Understand execution** - Know who performs the action (human vs system)
 * 2. **Generate implementations** - Create appropriate code for manual vs automated actions
 * 3. **Plan workflows** - Understand workflow automation opportunities
 * 4. **Set expectations** - Understand action execution requirements
 *
 * **What it checks:**
 * - Action should have `automationLevel` field (recommended, not required)
 * - Automation level aligns with actor type
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has automation level
 * @Action({
 *   name: 'Email Verified',
 *   automationLevel: StepAutomationLevel.SemiAutomated,
 *   scope: ActionScope.Journey
 * })
 *
 * // ⚠️ Warning - Missing automation level (recommended)
 * @Action({
 *   name: 'Email Verified',
 *   scope: ActionScope.Journey
 *   // Missing automationLevel - consider adding
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingAutomationLevel';

export const actionAutomationLevelRecommended = createRule<[], MessageIds>({
  name: 'action-automation-level-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions should have automationLevel field. Automation level specifies who/what performs an action, helping teams understand execution context and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingAutomationLevel:
        "Action '{{name}}' is missing an 'automationLevel' field. Automation level specifies who/what performs an action (Manual, SemiAutomated, FullyAutomated, AIAssisted). Automation level helps teams understand action execution, enables AI systems to generate appropriate implementations, and supports workflow planning. Add an automationLevel field (e.g., 'automationLevel: StepAutomationLevel.Manual' for human actions, 'automationLevel: StepAutomationLevel.FullyAutomated' for system actions).",
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
          const automationLevel = decorator.metadata.automationLevel;

          // Check if automationLevel is missing (recommended, not required)
          if (!automationLevel) {
            context.report({
              node: decorator.node,
              messageId: 'missingAutomationLevel',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if automationLevel already exists in source to avoid duplicates
                if (source.includes('automationLevel:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const automationLevelTemplate = needsComma
                  ? `,\n  automationLevel: StepAutomationLevel.Manual,  // TODO: Choose appropriate level (Manual, SemiAutomated, FullyAutomated, AIAssisted)`
                  : `\n  automationLevel: StepAutomationLevel.Manual,  // TODO: Choose appropriate level (Manual, SemiAutomated, FullyAutomated, AIAssisted)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  automationLevelTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

