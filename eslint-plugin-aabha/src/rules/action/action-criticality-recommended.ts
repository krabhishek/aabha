/**
 * Action Criticality Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **criticality** specifies the importance of an action
 * to journey success (Optional, Recommended, Required, Critical). Criticality helps teams understand
 * action importance, enables AI systems to prioritize actions, and supports error handling decisions.
 * While not always required, criticality is important for understanding action impact on journey success.
 *
 * Criticality enables AI to:
 * 1. **Understand importance** - Know how critical an action is to journey success
 * 2. **Prioritize actions** - Focus on critical actions in journey planning
 * 3. **Handle errors** - Determine if action failure should stop the journey
 * 4. **Plan resilience** - Identify actions that need fallback strategies
 *
 * **What it checks:**
 * - Action should have `criticality` field (recommended, not required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has criticality
 * @Action({
 *   name: 'Email Verified',
 *   criticality: StepCriticality.Critical,
 *   scope: ActionScope.Journey
 * })
 *
 * // ⚠️ Warning - Missing criticality (recommended)
 * @Action({
 *   name: 'Email Verified',
 *   scope: ActionScope.Journey
 *   // Missing criticality - consider adding
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCriticality';

export const actionCriticalityRecommended = createRule<[], MessageIds>({
  name: 'action-criticality-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions should have criticality field. Criticality specifies the importance of an action to journey success, helping teams understand impact and enabling AI to prioritize actions.',
    },
    messages: {
      missingCriticality:
        "Action '{{name}}' is missing a 'criticality' field. Criticality specifies the importance of an action to journey success (Optional, Recommended, Required, Critical). Criticality helps teams understand action importance, enables AI systems to prioritize actions, and supports error handling decisions. Add a criticality field (e.g., 'criticality: StepCriticality.Required' or 'criticality: StepCriticality.Critical').",
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
          const criticality = decorator.metadata.criticality;

          // Check if criticality is missing (recommended, not required)
          if (!criticality) {
            context.report({
              node: decorator.node,
              messageId: 'missingCriticality',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if criticality already exists in source to avoid duplicates
                if (source.includes('criticality:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const criticalityTemplate = needsComma
                  ? `,\n  criticality: StepCriticality.Required,  // TODO: Choose appropriate criticality (Optional, Recommended, Required, Critical)`
                  : `\n  criticality: StepCriticality.Required,  // TODO: Choose appropriate criticality (Optional, Recommended, Required, Critical)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  criticalityTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

