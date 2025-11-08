/**
 * Stakeholder Organization Formal Agreements Rule
 *
 * **Why this rule exists:**
 * Organization stakeholders represent external organizations, partners, regulators, or vendors.
 * They have unique relationship patterns that often involve formal agreements, contracts, and
 * structured relationships. Organization stakeholders need documented formal agreements and
 * relationship structures. Without formal agreements, teams cannot understand the legal and
 * contractual framework governing organizational relationships.
 *
 * Formal agreements enable AI to:
 * 1. **Understand legal framework** - Know what agreements govern organizational relationships
 * 2. **Track compliance** - Understand contractual obligations and requirements
 * 3. **Plan engagements** - Understand relationship structure and formal touchpoints
 * 4. **Manage relationships** - Track agreements and contract terms
 *
 * **What it checks:**
 * - Organization stakeholders should have `relationships` with `formalAgreements` when applicable
 * - Organization stakeholders should have `strategicImportance` documented
 * - Organization stakeholders should have `businessValue` when they are important or critical
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has formal agreements documented
 * @Stakeholder({
 *   type: StakeholderType.Organization,
 *   role: 'External Auditor',
 *   strategicImportance: 'important',
 *   businessValue: 'Provides annual audit services ensuring regulatory compliance',
 *   relationships: [
 *     {
 *       stakeholder: ComplianceTeamStakeholder,
 *       relationshipType: 'collaborates-with',
 *       formalAgreements: ['Annual Engagement Letter 2024', 'SLA Agreement']
 *     }
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing formal agreements
 * @Stakeholder({
 *   type: StakeholderType.Organization,
 *   role: 'External Auditor',
 *   relationships: [
 *     {
 *       stakeholder: ComplianceTeamStakeholder,
 *       relationshipType: 'collaborates-with'
 *       // Missing formalAgreements
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

type MessageIds = 'missingFormalAgreements' | 'missingStrategicImportance';

export const stakeholderOrganizationFormalAgreements = createRule<[], MessageIds>({
  name: 'stakeholder-organization-formal-agreements',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Organization stakeholders should have formal agreements documented. Organization stakeholders need formalAgreements in relationships and strategicImportance documented.',
    },
    messages: {
      missingFormalAgreements:
        "Organization stakeholder '{{name}}' has relationships but missing formalAgreements. Organization stakeholders often have formal agreements, contracts, or SLAs governing relationships. Add formalAgreements to relationships (e.g., 'formalAgreements: [\"Annual Engagement Letter 2024\", \"SLA Agreement\"]').",
      missingStrategicImportance:
        "Organization stakeholder '{{name}}' should have strategicImportance documented. Organization stakeholders need clear strategic importance classification (critical, important, or supporting) to understand their role in the organization. Add strategicImportance field.",
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

          const stakeholderType = decorator.metadata.type as string | undefined;
          // Normalize stakeholderType to handle both enum values and enum references
          const typeNormalized = stakeholderType?.toLowerCase().replace('stakeholdertype.', '') || '';
          if (typeNormalized !== 'organization') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const relationships = decorator.metadata.relationships as
            | Array<{
                formalAgreements?: string[];
                [key: string]: unknown;
              }>
            | undefined;
          const strategicImportance = decorator.metadata.strategicImportance;

          // Check for missing strategic importance
          if (!strategicImportance) {
            context.report({
              node: decorator.node,
              messageId: 'missingStrategicImportance',
              data: { name },
            });
          }

          // Check relationships for formal agreements
          if (relationships && relationships.length > 0) {
            const hasFormalAgreements = relationships.some(
              (rel) => rel.formalAgreements && Array.isArray(rel.formalAgreements) && rel.formalAgreements.length > 0,
            );

            if (!hasFormalAgreements) {
              context.report({
                node: decorator.node,
                messageId: 'missingFormalAgreements',
                data: { name },
              });
            }
          }
        }
      },
    };
  },
});

