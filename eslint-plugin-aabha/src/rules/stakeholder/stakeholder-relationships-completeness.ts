/**
 * Stakeholder Relationships Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, relationships describe how stakeholders relate to other stakeholders.
 * When relationships is specified, each relationship should include key fields (stakeholder, relationshipType)
 * to be useful for understanding organizational dynamics and dependencies. Incomplete relationships leave
 * teams without critical information needed for understanding stakeholder interactions and organizational
 * structure.
 *
 * Relationships completeness enables AI to:
 * 1. **Understand organizational dynamics** - Know how stakeholders relate to each other
 * 2. **Model dependencies** - Understand stakeholder-to-stakeholder dependencies
 * 3. **Plan communication** - Understand interaction frequency and channels
 * 4. **Track agreements** - Know what formal agreements govern relationships
 *
 * **What it checks:**
 * - Relationships should include required fields: stakeholder, relationshipType
 * - Relationships should have description when relationshipType is complex
 * - Recommended fields: interactionFrequency, communicationChannels
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete relationship
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   relationships: [
 *     {
 *       stakeholder: FinancialAdvisorStakeholder,
 *       relationshipType: 'collaborates-with',
 *       description: 'Primary advisory relationship for investment strategy and execution',
 *       interactionFrequency: 'quarterly',
 *       communicationChannels: ['video-call', 'email', 'phone'],
 *       formalAgreements: ['Investment Advisory Agreement 2024']
 *     }
 *   ]
 * })
 *
 * // ⚠️ Warning - Incomplete relationship
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   relationships: [
 *     {
 *       stakeholder: FinancialAdvisorStakeholder,
 *       relationshipType: 'collaborates-with'
 *       // Missing description, interactionFrequency, communicationChannels
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

type MessageIds = 'incompleteRelationship';

export const stakeholderRelationshipsCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-relationships-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders with relationships should include key fields. Complete relationships enable understanding of organizational dynamics and stakeholder interactions.',
    },
    messages: {
      incompleteRelationship:
        "Stakeholder '{{name}}' has relationships but relationship at index {{index}} is missing key fields. Relationships should include stakeholder, relationshipType, and description to provide complete relationship documentation. Add missing fields: {{missingFields}}. Without these fields, teams lack critical information needed for understanding stakeholder interactions.",
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
          const relationships = decorator.metadata.relationships as
            | Array<{
                stakeholder?: unknown;
                relationshipType?: string;
                description?: string;
                interactionFrequency?: string;
                communicationChannels?: string[];
                [key: string]: unknown;
              }>
            | undefined;

          // Only check if relationships exists
          if (!relationships || relationships.length === 0) {
            continue;
          }

          // Check each relationship
          relationships.forEach((relationship, index) => {
            const missingFields: string[] = [];

            if (!relationship.stakeholder) {
              missingFields.push('stakeholder');
            }
            if (!relationship.relationshipType) {
              missingFields.push('relationshipType');
            }
            // Description is recommended for clarity
            if (!relationship.description) {
              missingFields.push('description');
            }

            if (missingFields.length > 0) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteRelationship',
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

