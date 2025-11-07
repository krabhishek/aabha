/**
 * Stakeholder Role Definition Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **role definition fields** (goals, responsibilities, accountability,
 * interests, constraints) are essential for understanding what stakeholders do and what they care about.
 * Without these fields, AI systems can't understand stakeholder motivations, generate accurate
 * recommendations, or model stakeholder behavior in business processes.
 *
 * Role definition enables AI to:
 * 1. **Understand stakeholder motivations** - Goals explain what stakeholders want to achieve
 * 2. **Model stakeholder behavior** - Responsibilities show what stakeholders do
 * 3. **Track accountability** - Accountability defines what stakeholders are responsible for
 * 4. **Understand priorities** - Interests show what matters to stakeholders
 * 5. **Respect boundaries** - Constraints define what stakeholders can't do
 *
 * Missing role definition means AI can't properly model stakeholder behavior or generate accurate recommendations.
 *
 * **What it checks:**
 * - Stakeholders have `goals` array (what they want to achieve)
 * - Stakeholders have `responsibilities` array (what they do)
 * - Stakeholders have `accountability` array (what they're responsible for)
 * - Arrays are not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete role definition
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   goals: ['Achieve 8-10% annual returns', 'Build diversified portfolio'],
 *   responsibilities: ['Review investment opportunities', 'Approve recommendations'],
 *   accountability: ['Portfolio performance meets benchmark', 'Compliance with policy'],
 *   interests: ['High returns with moderate risk', 'ESG compliance'],
 *   constraints: ['Cannot invest in tobacco', 'Must diversify']
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - Missing role definition
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing goals, responsibilities, accountability
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingGoals'
  | 'missingResponsibilities'
  | 'missingAccountability'
  | 'emptyGoals'
  | 'emptyResponsibilities'
  | 'emptyAccountability';

export const stakeholderRoleDefinition = createRule<[], MessageIds>({
  name: 'stakeholder-role-definition',
  meta: {
    type: 'problem',
    docs: {
      description: 'Stakeholders should have complete role definition with goals, responsibilities, and accountability',
    },
    messages: {
      missingGoals: "Stakeholder '{{name}}' is missing a 'goals' field. Goals explain what stakeholders want to achieve and help AI systems understand stakeholder motivations. Add a goals array (e.g., 'goals: [\"Achieve 8-10% annual returns\", \"Build diversified portfolio\"]').",
      missingResponsibilities: "Stakeholder '{{name}}' is missing a 'responsibilities' field. Responsibilities show what stakeholders do and help AI systems model stakeholder behavior. Add a responsibilities array (e.g., 'responsibilities: [\"Review investment opportunities\", \"Approve recommendations\"]').",
      missingAccountability: "Stakeholder '{{name}}' is missing an 'accountability' field. Accountability defines what stakeholders are responsible for and helps AI systems track outcomes. Add an accountability array (e.g., 'accountability: [\"Portfolio performance meets benchmark\", \"Compliance with policy\"]').",
      emptyGoals: "Stakeholder '{{name}}' has an empty 'goals' array. Goals are essential for understanding stakeholder motivations. Add at least one goal to the goals array.",
      emptyResponsibilities: "Stakeholder '{{name}}' has an empty 'responsibilities' array. Responsibilities are essential for modeling stakeholder behavior. Add at least one responsibility to the responsibilities array.",
      emptyAccountability: "Stakeholder '{{name}}' has an empty 'accountability' array. Accountability is essential for tracking stakeholder outcomes. Add at least one accountability item to the accountability array.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Stakeholder decorators
          if (decorator.type !== 'Stakeholder') {
            continue;
          }

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const goals = decorator.metadata.goals;
          const responsibilities = decorator.metadata.responsibilities;
          const accountability = decorator.metadata.accountability;

          if (!goals) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoals',
              data: { name },
            });
          } else if (Array.isArray(goals) && goals.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyGoals',
              data: { name },
            });
          }

          if (!responsibilities) {
            context.report({
              node: decorator.node,
              messageId: 'missingResponsibilities',
              data: { name },
            });
          } else if (Array.isArray(responsibilities) && responsibilities.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyResponsibilities',
              data: { name },
            });
          }

          if (!accountability) {
            context.report({
              node: decorator.node,
              messageId: 'missingAccountability',
              data: { name },
            });
          } else if (Array.isArray(accountability) && accountability.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyAccountability',
              data: { name },
            });
          }
        }
      },
    };
  },
});
