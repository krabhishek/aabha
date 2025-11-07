/**
 * Stakeholder Engagement Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **engagement fields** define how stakeholders interact
 * with the organization. Engagement information (frequency, touchpoints, communication preferences)
 * enables AI systems to understand stakeholder interaction patterns, generate communication plans,
 * and model stakeholder engagement.
 *
 * Engagement completeness enables AI to:
 * 1. **Understand interaction patterns** - Know how often stakeholders engage
 * 2. **Generate communication plans** - Create engagement strategies
 * 3. **Model stakeholder behavior** - Understand when and how stakeholders interact
 * 4. **Optimize touchpoints** - Identify effective communication channels
 *
 * Missing engagement information means AI can't model stakeholder interactions or generate engagement strategies.
 *
 * **What it checks:**
 * - Stakeholders have `engagement` field (frequency of engagement)
 * - Stakeholders have `touchpoints` array (interaction points)
 * - Arrays are not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete engagement
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   engagement: 'daily',
 *   touchpoints: ['Mobile app - Daily portfolio check', 'Email - Weekly updates']
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - Missing engagement
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing engagement and touchpoints
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingEngagement' | 'missingTouchpoints' | 'emptyTouchpoints';

export const stakeholderEngagementCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-engagement-completeness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Stakeholders should have complete engagement information including frequency and touchpoints',
    },
    messages: {
      missingEngagement: "Stakeholder '{{name}}' is missing an 'engagement' field. Engagement frequency defines how often stakeholders interact with the organization and helps AI systems understand interaction patterns. Add an engagement field (e.g., 'engagement: \"daily\"' or 'engagement: \"quarterly\"').",
      missingTouchpoints: "Stakeholder '{{name}}' is missing a 'touchpoints' field. Touchpoints identify interaction points and help AI systems generate communication plans. Add a touchpoints array (e.g., 'touchpoints: [\"Mobile app - Daily check\", \"Email - Weekly updates\"]').",
      emptyTouchpoints: "Stakeholder '{{name}}' has an empty 'touchpoints' array. Touchpoints are essential for understanding stakeholder interactions. Add at least one touchpoint to the touchpoints array.",
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
          const engagement = decorator.metadata.engagement;
          const touchpoints = decorator.metadata.touchpoints;

          if (!engagement) {
            context.report({
              node: decorator.node,
              messageId: 'missingEngagement',
              data: { name },
            });
          }

          if (!touchpoints) {
            context.report({
              node: decorator.node,
              messageId: 'missingTouchpoints',
              data: { name },
            });
          } else if (Array.isArray(touchpoints) && touchpoints.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyTouchpoints',
              data: { name },
            });
          }
        }
      },
    };
  },
});
