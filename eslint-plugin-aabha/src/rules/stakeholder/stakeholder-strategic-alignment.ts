/**
 * Stakeholder Strategic Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **strategic alignment** ensures that stakeholders with high
 * strategic importance have clear business value and risk management. Critical stakeholders without
 * business value documentation or risk assessment create blind spots in strategic planning. AI
 * systems need this information to prioritize stakeholder engagement and understand organizational
 * dependencies.
 *
 * Strategic alignment enables AI to:
 * 1. **Prioritize engagement** - Understand which stakeholders are most critical
 * 2. **Assess business impact** - Know the value each stakeholder brings
 * 3. **Manage risks** - Identify and mitigate stakeholder-related risks
 * 4. **Generate strategic reports** - Create stakeholder impact and risk assessments
 *
 * Missing strategic alignment information means AI can't properly prioritize or manage critical stakeholders.
 *
 * **What it checks:**
 * - Stakeholders with `strategicImportance: 'critical'` have `businessValue` defined
 * - Stakeholders with `strategicImportance: 'critical'` have `risks` array defined
 * - Critical stakeholders have comprehensive strategic alignment documentation
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete strategic alignment
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   strategicImportance: 'critical',
 *   businessValue: 'Provides $2M+ in assets under management with low churn risk',
 *   risks: [
 *     { risk: 'May switch to competitor', likelihood: 'medium', impact: 'high', mitigation: 'Quarterly check-ins' }
 *   ]
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - Critical stakeholder missing strategic alignment
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   strategicImportance: 'critical'
 *   // Missing businessValue and risks
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalMissingBusinessValue' | 'criticalMissingRisks';

export const stakeholderStrategicAlignment = createRule<[], MessageIds>({
  name: 'stakeholder-strategic-alignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Critical stakeholders should have business value and risk assessment documented for strategic alignment',
    },
    messages: {
      criticalMissingBusinessValue: "Critical stakeholder '{{name}}' is missing 'businessValue'. Stakeholders with strategicImportance 'critical' need clear documentation of the business value they bring. This helps AI systems prioritize engagement and understand organizational dependencies. Add a businessValue field describing the tangible or intangible value this stakeholder contributes (e.g., 'Provides $2M+ in assets under management with low churn risk').",
      criticalMissingRisks: "Critical stakeholder '{{name}}' is missing 'risks'. Stakeholders with strategicImportance 'critical' need risk assessment to identify potential threats and mitigation strategies. This helps AI systems generate risk reports and proactive management recommendations. Add a risks array with risk assessments (e.g., 'risks: [{ risk: \"May switch to competitor\", likelihood: \"medium\", impact: \"high\", mitigation: \"Quarterly check-ins\" }]').",
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

          const strategicImportance = decorator.metadata.strategicImportance;
          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const businessValue = decorator.metadata.businessValue;
          const risks = decorator.metadata.risks;

          // Only check critical stakeholders
          if (strategicImportance !== 'critical') {
            continue;
          }

          if (!businessValue) {
            context.report({
              node: decorator.node,
              messageId: 'criticalMissingBusinessValue',
              data: { name },
            });
          }

          if (!risks || (Array.isArray(risks) && risks.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'criticalMissingRisks',
              data: { name },
            });
          }
        }
      },
    };
  },
});
