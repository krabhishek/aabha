/**
 * Stakeholder Collaboration Patterns Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, collaboration patterns describe how stakeholders work together.
 * When collaborationPatterns is specified, each pattern should include key fields (withStakeholder,
 * collaborationType, purpose, frequency) to be useful for understanding collaboration dynamics.
 * Incomplete collaboration patterns leave teams without critical information needed for planning
 * and optimizing stakeholder collaboration.
 *
 * Collaboration patterns completeness enables AI to:
 * 1. **Understand collaboration dynamics** - Know how stakeholders work together
 * 2. **Plan touchpoints** - Understand when and where collaboration happens
 * 3. **Track artifacts** - Know what documents or outputs are exchanged
 * 4. **Optimize workflows** - Improve collaboration efficiency
 *
 * **What it checks:**
 * - Collaboration patterns should include required fields: withStakeholder, collaborationType, purpose, frequency
 * - Patterns should have meaningful touchpoints or artifacts when applicable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete collaboration pattern
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   collaborationPatterns: [
 *     {
 *       withStakeholder: FinancialAdvisorStakeholder,
 *       collaborationType: 'sync',
 *       purpose: 'Joint review of investment performance and strategy adjustments',
 *       frequency: 'quarterly',
 *       touchpoints: ['Quarterly review meeting', 'Ad-hoc phone calls'],
 *       artifacts: ['Performance reports', 'Investment proposals']
 *     }
 *   ]
 * })
 *
 * // ⚠️ Warning - Incomplete collaboration pattern
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   collaborationPatterns: [
 *     {
 *       withStakeholder: FinancialAdvisorStakeholder,
 *       collaborationType: 'sync'
 *       // Missing purpose, frequency
 *     }
 *   ]
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteCollaborationPattern';

export const stakeholderCollaborationPatternsCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-collaboration-patterns-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders with collaborationPatterns should include key fields. Complete collaboration patterns enable effective stakeholder collaboration planning.',
    },
    messages: {
      incompleteCollaborationPattern:
        "Stakeholder '{{name}}' has collaborationPatterns but pattern at index {{index}} is missing key fields. Collaboration patterns should include withStakeholder, collaborationType, purpose, and frequency to provide complete collaboration documentation. Add missing fields: {{missingFields}}. Without these fields, teams lack critical information needed for planning stakeholder collaboration.",
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
          const collaborationPatterns = decorator.metadata.collaborationPatterns as
            | Array<{
                withStakeholder?: unknown;
                collaborationType?: string;
                purpose?: string;
                frequency?: string;
                touchpoints?: string[];
                artifacts?: string[];
                [key: string]: unknown;
              }>
            | undefined;

          // Only check if collaborationPatterns exists
          if (!collaborationPatterns || collaborationPatterns.length === 0) {
            continue;
          }

          // Check each collaboration pattern
          collaborationPatterns.forEach((pattern, index) => {
            const missingFields: string[] = [];

            if (!pattern.withStakeholder) {
              missingFields.push('withStakeholder');
            }
            if (!pattern.collaborationType) {
              missingFields.push('collaborationType');
            }
            if (!pattern.purpose) {
              missingFields.push('purpose');
            }
            if (!pattern.frequency) {
              missingFields.push('frequency');
            }

            if (missingFields.length > 0) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteCollaborationPattern',
                data: {
                  name,
                  index: index.toString(),
                  missingFields: missingFields.join(', '),
                },
              });
            }
          });
        }
      },
    };
  },
});

