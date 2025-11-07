/**
 * Expectation Additional Stakeholders Unique Roles Rule
 *
 * **Why this rule exists:**
 * In context engineering, expectations involve multiple stakeholders beyond the primary provider
 * and consumer. When additional stakeholders participate, each must have a **distinct, well-defined role**
 * in the expectation's context. Duplicate roles create ambiguity that prevents AI systems from
 * understanding stakeholder responsibilities and relationships.
 *
 * Duplicate stakeholder roles cause:
 * - **Responsibility confusion** - Which stakeholder fulfills which role when two share the same one?
 * - **AI comprehension failure** - AI cannot map stakeholders to their actual responsibilities
 * - **Communication issues** - Unclear who to notify or involve for specific aspects
 * - **Governance problems** - Ambiguous accountability and decision-making authority
 *
 * Unique roles enable:
 * 1. **Clear stakeholder mapping** - Each stakeholder's responsibility is unambiguous
 * 2. **AI-assisted orchestration** - AI can generate correct notification and workflow code
 * 3. **Self-documenting relationships** - Role names explain each stakeholder's involvement
 * 4. **Traceable accountability** - Each role can be audited and monitored independently
 *
 * **What it checks:**
 * - All additionalStakeholders have unique role names
 * - No duplicate role strings within the array
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Unique roles clearly define each stakeholder's involvement
 * @Expectation({
 *   name: 'High-Value Account Opening',
 *   provider: BankingSystem,
 *   consumer: DigitalFirstCustomer,
 *   interaction: AccountOpeningAPI,
 *   additionalStakeholders: [
 *     { stakeholder: ComplianceOfficer, role: 'approver', description: 'Approves high-value accounts' },
 *     { stakeholder: RelationshipManager, role: 'advisor', description: 'Provides guidance' },
 *     { stakeholder: AuditSystem, role: 'auditor', description: 'Records all actions' }
 *   ]
 * })
 *
 * // ❌ Bad - Duplicate 'reviewer' role creates ambiguity
 * @Expectation({
 *   name: 'High-Value Account Opening',
 *   provider: BankingSystem,
 *   consumer: DigitalFirstCustomer,
 *   interaction: AccountOpeningAPI,
 *   additionalStakeholders: [
 *     { stakeholder: ComplianceOfficer, role: 'reviewer' },
 *     { stakeholder: RiskManager, role: 'reviewer' }, // Duplicate!
 *     { stakeholder: AuditSystem, role: 'auditor' }
 *   ]
 * })
 * // AI can't determine: Which 'reviewer' approves? Do both need to review?
 * // Better: Use 'compliance-reviewer' and 'risk-reviewer'
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'duplicateStakeholderRoles';

export const expectationAdditionalStakeholdersUniqueRoles = createRule<[], MessageIds>({
  name: 'expectation-additional-stakeholders-unique-roles',
  meta: {
    type: 'problem',
    docs: {
      description: 'Additional stakeholders in expectations must have unique roles to avoid responsibility ambiguity. In context engineering, duplicate roles prevent AI systems from understanding which stakeholder fulfills which responsibility in the expectation context.',
    },
    messages: {
      duplicateStakeholderRoles: "Expectation '{{expectationName}}' has duplicate roles in additionalStakeholders: {{duplicateRoles}}. In context engineering, each additional stakeholder must have a unique role to establish clear responsibility mapping. When multiple stakeholders share the same role, AI systems cannot determine who is accountable for specific aspects, who should be notified, or who makes decisions. This ambiguity creates governance problems and makes it impossible to generate correct workflow coordination code. Use descriptive, distinct role names (e.g., 'compliance-reviewer' and 'risk-reviewer' instead of 'reviewer' for both). Clear role names enable AI to understand stakeholder relationships and generate accurate orchestration logic.",
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
          if (decorator.type !== 'Expectation') continue;

          const expectationName = decorator.metadata.name as string | undefined;
          const additionalStakeholders = decorator.metadata.additionalStakeholders as Array<{
            role: string;
          }> | undefined;

          if (!additionalStakeholders || additionalStakeholders.length === 0) {
            continue;
          }

          // Extract all roles
          const roles = additionalStakeholders.map((as) => as.role);

          // Find duplicates
          const duplicates = roles.filter((role, index) => roles.indexOf(role) !== index);

          if (duplicates.length > 0) {
            // Get unique duplicates for reporting
            const uniqueDuplicates = [...new Set(duplicates)];

            context.report({
              node: decorator.node,
              messageId: 'duplicateStakeholderRoles',
              data: {
                expectationName: expectationName || 'Unknown',
                duplicateRoles: uniqueDuplicates.join(', '),
              },
            });
          }
        }
      },
    };
  },
});
