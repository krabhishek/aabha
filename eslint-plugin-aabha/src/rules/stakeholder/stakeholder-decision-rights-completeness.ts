/**
 * Stakeholder Decision Rights Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, decision rights define what decisions stakeholders can approve, veto,
 * or must be consulted on. When decisionRights is specified or when stakeholders have high influence,
 * it should include key fields to be useful for understanding governance and decision-making authority.
 * Incomplete decision rights leave teams without critical information needed for understanding
 * stakeholder authority and decision-making processes.
 *
 * Decision rights completeness enables AI to:
 * 1. **Understand governance** - Know who can make what decisions
 * 2. **Model decision-making** - Understand approval/veto/consultation patterns
 * 3. **Generate workflows** - Create decision workflows based on rights
 * 4. **Track authority** - Understand stakeholder decision-making authority
 *
 * **What it checks:**
 * - Stakeholders with decisionRights should include at least one decision category
 * - Stakeholders with high influence should have decisionRights or decisionAuthority
 * - Decision rights should include canApprove, canVeto, mustConsult, or mustInform
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete decision rights
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   influence: 'high',
 *   decisionRights: {
 *     canApprove: ['Individual investments under $50K', 'Rebalancing within asset allocation bands'],
 *     canVeto: ['Investments violating ESG criteria', 'High-risk investments outside policy'],
 *     mustConsult: ['Major strategy changes', 'Asset allocation shifts > 10%'],
 *     mustInform: ['All trades and transactions', 'Quarterly performance reports']
 *   }
 * })
 *
 * // ⚠️ Warning - Incomplete decision rights
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   influence: 'high',
 *   decisionRights: {
 *     canApprove: ['Individual investments']
 *     // Missing canVeto, mustConsult, mustInform
 *   }
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteDecisionRights' | 'highInfluenceMissingDecisionRights';

export const stakeholderDecisionRightsCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-decision-rights-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders with decisionRights should include key decision categories. High-influence stakeholders should have decisionRights or decisionAuthority documented.',
    },
    messages: {
      incompleteDecisionRights:
        "Stakeholder '{{name}}' has decisionRights but missing recommended fields. Decision rights should include canApprove, canVeto, mustConsult, or mustInform to provide complete governance documentation. Add at least one additional decision category beyond what's already defined.",
      highInfluenceMissingDecisionRights:
        "High-influence stakeholder '{{name}}' should have decisionRights or decisionAuthority documented. High-influence stakeholders need clear documentation of their decision-making authority. Add either a decisionRights object with canApprove/canVeto/mustConsult/mustInform, or a decisionAuthority array describing decision types.",
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
          if (decorator.type !== 'Stakeholder') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const influence = decorator.metadata.influence;
          const decisionRights = decorator.metadata.decisionRights as
            | {
                canApprove?: string[];
                canVeto?: string[];
                mustConsult?: string[];
                mustInform?: string[];
                [key: string]: unknown;
              }
            | undefined;
          const decisionAuthority = decorator.metadata.decisionAuthority as string[] | undefined;

          // Check for high-influence stakeholders missing decision rights
          if (influence === 'high' && !decisionRights && (!decisionAuthority || decisionAuthority.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'highInfluenceMissingDecisionRights',
              data: { name },
            });
            continue;
          }

          // Only check completeness if decisionRights exists
          if (!decisionRights || Object.keys(decisionRights).length === 0) {
            continue;
          }

          // Check if decisionRights has at least one meaningful category
          const hasCanApprove = decisionRights.canApprove && decisionRights.canApprove.length > 0;
          const hasCanVeto = decisionRights.canVeto && decisionRights.canVeto.length > 0;
          const hasMustConsult = decisionRights.mustConsult && decisionRights.mustConsult.length > 0;
          const hasMustInform = decisionRights.mustInform && decisionRights.mustInform.length > 0;

          // If only one category is defined, suggest adding more for completeness
          const categoryCount = [hasCanApprove, hasCanVeto, hasMustConsult, hasMustInform].filter(Boolean).length;
          if (categoryCount === 1) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteDecisionRights',
              data: { name },
            });
          }
        }
      },
    };
  },
});

