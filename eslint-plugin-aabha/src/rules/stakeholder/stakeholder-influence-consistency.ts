/**
 * Stakeholder Influence Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **influence consistency** ensures that stakeholders with
 * high influence have detailed influence documentation. High-influence stakeholders without
 * influenceSphere or decisionAuthority create blind spots - AI systems can't understand their
 * power dynamics or decision-making authority.
 *
 * Influence consistency enables AI to:
 * 1. **Understand power dynamics** - Know which stakeholders have significant influence
 * 2. **Model decision-making** - Understand who can make decisions and in what areas
 * 3. **Generate engagement strategies** - Prioritize engagement with high-influence stakeholders
 * 4. **Track decision authority** - Understand who has approval/veto rights
 *
 * Missing influence documentation means AI can't properly model stakeholder power dynamics.
 *
 * **What it checks:**
 * - Stakeholders with `influence: 'high'` have `influenceSphere` array
 * - Stakeholders with `influence: 'high'` have `decisionAuthority` array
 * - Arrays are not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete influence documentation
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   influence: 'high',
 *   influenceSphere: ['Investment strategy', 'Fee negotiations'],
 *   decisionAuthority: ['Approval of investments up to $50K']
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - High influence without documentation
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   influence: 'high'
 *   // Missing influenceSphere and decisionAuthority
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'highInfluenceMissingSphere' | 'highInfluenceMissingAuthority' | 'emptyInfluenceSphere' | 'emptyDecisionAuthority';

export const stakeholderInfluenceConsistency = createRule<[], MessageIds>({
  name: 'stakeholder-influence-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'High-influence stakeholders should have complete influence documentation including influenceSphere and decisionAuthority',
    },
    messages: {
      highInfluenceMissingSphere: "High-influence stakeholder '{{name}}' is missing an 'influenceSphere' field. Influence sphere defines areas where the stakeholder has significant influence and helps AI systems understand power dynamics. Add an influenceSphere array (e.g., 'influenceSphere: [\"Investment strategy\", \"Fee negotiations\"]').",
      highInfluenceMissingAuthority: "High-influence stakeholder '{{name}}' is missing a 'decisionAuthority' field. Decision authority defines what decisions the stakeholder can make and helps AI systems model decision-making. Add a decisionAuthority array (e.g., 'decisionAuthority: [\"Approval of investments up to $50K\"]').",
      emptyInfluenceSphere: "High-influence stakeholder '{{name}}' has an empty 'influenceSphere' array. Influence sphere is essential for understanding stakeholder power dynamics. Add at least one area of influence.",
      emptyDecisionAuthority: "High-influence stakeholder '{{name}}' has an empty 'decisionAuthority' array. Decision authority is essential for modeling stakeholder decision-making. Add at least one decision authority item.",
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

          const influence = decorator.metadata.influence;
          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const influenceSphere = decorator.metadata.influenceSphere;
          const decisionAuthority = decorator.metadata.decisionAuthority;

          // Only check high-influence stakeholders
          if (influence !== 'high') {
            continue;
          }

          if (!influenceSphere) {
            context.report({
              node: decorator.node,
              messageId: 'highInfluenceMissingSphere',
              data: { name },
            });
          } else if (Array.isArray(influenceSphere) && influenceSphere.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyInfluenceSphere',
              data: { name },
            });
          }

          if (!decisionAuthority) {
            context.report({
              node: decorator.node,
              messageId: 'highInfluenceMissingAuthority',
              data: { name },
            });
          } else if (Array.isArray(decisionAuthority) && decisionAuthority.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDecisionAuthority',
              data: { name },
            });
          }
        }
      },
    };
  },
});
