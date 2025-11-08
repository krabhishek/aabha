/**
 * Persona Goals Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, goals are explicit, stated objectives that personas
 * want to achieve. Goals are distinct from needs - goals are what personas say they want,
 * while needs capture deeper functional, emotional, social, and informational requirements.
 * Without goals, personas lack clear objectives and teams cannot design for specific outcomes.
 *
 * Goals enable AI to:
 * 1. **Understand objectives** - Know what personas explicitly want to achieve
 * 2. **Design for outcomes** - Create features that help personas reach their goals
 * 3. **Measure success** - Track whether personas are achieving their goals
 * 4. **Prioritize features** - Focus on features that support persona goals
 *
 * **What it checks:**
 * - Personas should have goals field defined
 * - Goals should be meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has goals
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   goals: ['Save for house down payment', 'Build emergency fund', 'Start investing']
 * })
 *
 * // ❌ Bad - Missing goals
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing goals
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingGoals' | 'emptyGoals';

export const personaGoalsRequired = createRule<[], MessageIds>({
  name: 'persona-goals-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have goals field. Goals are explicit, stated objectives that personas want to achieve, helping teams design for specific outcomes.',
    },
    messages: {
      missingGoals:
        "Persona '{{personaName}}' is missing goals field. In context engineering, goals are explicit, stated objectives that personas want to achieve. Goals are distinct from needs - goals are what personas say they want, while needs capture deeper requirements. Add a 'goals' array with explicit objectives (e.g., 'goals: [\"Save for house down payment\", \"Build emergency fund\", \"Start investing\"]').",
      emptyGoals:
        "Persona '{{personaName}}' has goals field but it's empty. Goals should be meaningful and describe explicit objectives (e.g., 'Save for house down payment', 'Build emergency fund', 'Start investing', 'Manage finances efficiently'). Add meaningful goals that describe what this persona wants to achieve.",
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
          if (decorator.type !== 'Persona') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const goals = decorator.metadata.goals as string[] | undefined;

          // Check if goals is missing
          if (!goals) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoals',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if goals already exists in source to avoid duplicates
                if (source.includes('goals:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const goalsTemplate = `,\n  goals: [\n    '', // TODO: Explicit objectives this persona wants to achieve\n    '' // TODO: Add more goals (e.g., 'Save for house down payment', 'Build emergency fund')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  goalsTemplate,
                );
              },
            });
            continue;
          }

          // Check if goals is empty
          if (goals.length === 0 || goals.every((g) => typeof g === 'string' && g.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyGoals',
              data: {
                personaName: personaName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});

