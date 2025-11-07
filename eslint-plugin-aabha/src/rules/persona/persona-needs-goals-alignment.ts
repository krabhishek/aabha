/**
 * Persona Needs Goals Alignment Rule
 *
 * **Why this rule exists:**
 * Personas should have either needs or goals (or both) to be actionable. In context engineering,
 * needs represent deeper human requirements (functional, emotional, social, informational) while
 * goals are explicit outcomes personas want to achieve. Without needs or goals, teams cannot
 * design solutions that address persona requirements.
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingNeedsGoals';

export const personaNeedsGoalsAlignment = createRule<[], MessageIds>({
  name: 'persona-needs-goals-alignment',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have needs or goals defined. In context engineering, needs and goals enable teams to design solutions addressing persona requirements.',
    },
    messages: {
      missingNeedsGoals:
        "Persona '{{personaName}}' lacks both needs and goals. In context engineering, personas need either needs (functional, emotional, social, informational) or goals (explicit outcomes to achieve) to be actionable. Add needs field with needs: {{ functional: ['Track expenses automatically'], emotional: ['Feel in control of finances'], social: ['Be seen as financially responsible'], informational: ['Understand spending patterns'] }} OR goals field with goals: ['Build savings', 'Track spending easily', 'Start investing']. Without needs or goals, teams cannot design solutions that address persona requirements.",
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
          const needs = decorator.metadata.needs as
            | {
                functional?: string[];
                emotional?: string[];
                social?: string[];
                informational?: string[];
              }
            | undefined;
          const goals = decorator.metadata.goals as string[] | undefined;

          // Check if both needs and goals are missing
          const hasNeeds =
            needs && (needs.functional || needs.emotional || needs.social || needs.informational);
          const hasGoals = goals && goals.length > 0;

          if (!hasNeeds && !hasGoals) {
            context.report({
              node: decorator.node,
              messageId: 'missingNeedsGoals',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Add goals (simpler) rather than needs (more complex)
                const goalsTemplate = `,\n  goals: [\n    '', // TODO: What outcomes does this persona want to achieve?\n    '' // TODO: Add more goals\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  goalsTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});
