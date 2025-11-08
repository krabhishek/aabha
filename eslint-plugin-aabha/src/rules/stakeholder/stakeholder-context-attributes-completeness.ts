/**
 * Stakeholder Context Attributes Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, context-specific attributes (permissions, contextualNeeds,
 * painPoints, successCriteria) define what stakeholders need and experience within a specific context.
 * These attributes are essential for understanding stakeholder requirements, challenges, and success
 * indicators. Incomplete context attributes leave teams without critical information needed for
 * designing solutions and measuring stakeholder satisfaction.
 *
 * Context attributes completeness enables AI to:
 * 1. **Understand requirements** - Permissions and contextualNeeds define what stakeholders need
 * 2. **Identify problems** - PainPoints reveal challenges stakeholders face
 * 3. **Measure success** - SuccessCriteria define how to measure stakeholder satisfaction
 * 4. **Design solutions** - Complete attributes inform feature design and prioritization
 *
 * **What it checks:**
 * - Stakeholders should have at least one context attribute: permissions, contextualNeeds, painPoints, or successCriteria
 * - When specified, these arrays should not be empty
 * - Recommended: stakeholders should have permissions and contextualNeeds
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete context attributes
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   permissions: ['view_portfolio', 'initiate_transfers', 'approve_investments'],
 *   contextualNeeds: ['Real-time portfolio performance data', 'Risk analytics dashboard'],
 *   painPoints: ['Slow mobile app performance', 'Confusing fee structure'],
 *   successCriteria: ['Portfolio outperforms S&P 500 by 2%', 'Access info within 3 clicks']
 * })
 *
 * // ⚠️ Warning - Missing context attributes
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing permissions, contextualNeeds, painPoints, successCriteria
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingContextAttributes' | 'emptyContextAttributes';

export const stakeholderContextAttributesCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-context-attributes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders should have context-specific attributes. Complete context attributes enable understanding of stakeholder requirements, challenges, and success indicators.',
    },
    messages: {
      missingContextAttributes:
        "Stakeholder '{{name}}' is missing context-specific attributes. Context attributes (permissions, contextualNeeds, painPoints, successCriteria) define what stakeholders need and experience within a specific context. Add at least one of: permissions (what actions/resources are authorized), contextualNeeds (what resources/information are needed), painPoints (context-specific challenges), or successCriteria (how to measure success).",
      emptyContextAttributes:
        "Stakeholder '{{name}}' has context attributes but they are empty. Context attributes should include meaningful values. Add at least one item to permissions, contextualNeeds, painPoints, or successCriteria arrays.",
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
          const permissions = decorator.metadata.permissions as string[] | undefined;
          const contextualNeeds = decorator.metadata.contextualNeeds as string[] | undefined;
          const painPoints = decorator.metadata.painPoints as string[] | undefined;
          const successCriteria = decorator.metadata.successCriteria as string[] | undefined;

          // Check if any context attributes exist
          const hasPermissions = permissions && permissions.length > 0;
          const hasContextualNeeds = contextualNeeds && contextualNeeds.length > 0;
          const hasPainPoints = painPoints && painPoints.length > 0;
          const hasSuccessCriteria = successCriteria && successCriteria.length > 0;

          const hasAnyContextAttribute = hasPermissions || hasContextualNeeds || hasPainPoints || hasSuccessCriteria;

          // Check if all are missing
          if (!hasAnyContextAttribute) {
            context.report({
              node: decorator.node,
              messageId: 'missingContextAttributes',
              data: { name },
            });
            continue;
          }

          // Check if any are empty (defined but empty)
          const hasEmptyPermissions = permissions && permissions.length === 0;
          const hasEmptyContextualNeeds = contextualNeeds && contextualNeeds.length === 0;
          const hasEmptyPainPoints = painPoints && painPoints.length === 0;
          const hasEmptySuccessCriteria = successCriteria && successCriteria.length === 0;

          // If some are defined but empty, and none are populated, warn
          const hasEmptyButDefined = (hasEmptyPermissions || hasEmptyContextualNeeds || hasEmptyPainPoints || hasEmptySuccessCriteria) && !hasAnyContextAttribute;

          if (hasEmptyButDefined) {
            context.report({
              node: decorator.node,
              messageId: 'emptyContextAttributes',
              data: { name },
            });
          }
        }
      },
    };
  },
});

