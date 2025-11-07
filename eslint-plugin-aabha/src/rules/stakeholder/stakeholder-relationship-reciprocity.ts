/**
 * Stakeholder Relationship Reciprocity Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **relationship reciprocity** ensures that stakeholder
 * relationships are bidirectional. If Stakeholder A has a relationship to Stakeholder B,
 * Stakeholder B should typically have a corresponding relationship back to A. This creates
 * a complete organizational graph that AI systems can navigate and understand.
 *
 * Relationship reciprocity enables AI to:
 * 1. **Navigate organizational graph** - Traverse stakeholder relationships in both directions
 * 2. **Understand collaboration patterns** - See how stakeholders interact with each other
 * 3. **Generate relationship maps** - Create visualizations of stakeholder networks
 * 4. **Identify missing relationships** - Find gaps in relationship documentation
 *
 * Missing reciprocal relationships create incomplete organizational graphs that AI can't fully navigate.
 *
 * **What it checks:**
 * - Stakeholders with relationships should have reciprocal relationships documented
 * - Relationship types should be consistent (e.g., if A collaborates-with B, B should collaborate-with A)
 * - Note: This is a warning-level check as relationships may be intentionally one-way
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Reciprocal relationships
 * // Stakeholder A
 * @Stakeholder({
 *   role: 'Primary Investor',
 *   relationships: [{
 *     stakeholder: FinancialAdvisorStakeholder,
 *     relationshipType: 'collaborates-with'
 *   }]
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // Stakeholder B (should have reciprocal)
 * @Stakeholder({
 *   role: 'Financial Advisor',
 *   relationships: [{
 *     stakeholder: PrimaryInvestorStakeholder,
 *     relationshipType: 'collaborates-with'
 *   }]
 * })
 * export class FinancialAdvisorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingReciprocalRelationship';

export const stakeholderRelationshipReciprocity = createRule<[], MessageIds>({
  name: 'stakeholder-relationship-reciprocity',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Stakeholder relationships should be reciprocal to create a complete organizational graph',
    },
    messages: {
      missingReciprocalRelationship: "Stakeholder '{{name}}' has a relationship to '{{relatedName}}' but the relationship may not be reciprocal. For complete organizational graphs, relationships should typically be bidirectional. Consider adding a corresponding relationship from '{{relatedName}}' back to '{{name}}' to enable AI systems to navigate the stakeholder network in both directions.",
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
          const relationships = decorator.metadata.relationships;

          if (!relationships || !Array.isArray(relationships) || relationships.length === 0) {
            continue;
          }

          // Check each relationship
          for (const rel of relationships) {
            if (typeof rel === 'object' && rel !== null) {
              const relatedStakeholder = (rel as Record<string, unknown>).stakeholder;
              const relationshipType = (rel as Record<string, unknown>).relationshipType;

              // Extract related stakeholder name (could be a class reference, so we use a generic message)
              const relatedName = typeof relatedStakeholder === 'string' ? relatedStakeholder : 'related stakeholder';

              // Note: We can't fully verify reciprocity without type information,
              // so we provide a suggestion to check relationships
              // This is a soft check that encourages documentation completeness
              if (relationshipType && ['collaborates-with', 'reports-to', 'depends-on'].includes(String(relationshipType))) {
                // For symmetric relationships, suggest reciprocity
                context.report({
                  node: decorator.node,
                  messageId: 'missingReciprocalRelationship',
                  data: {
                    name,
                    relatedName,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});
