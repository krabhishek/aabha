/**
 * Stakeholder Required Fields Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, stakeholders must have core required fields (type, role, persona, context)
 * to be valid and actionable. These fields define the fundamental identity of a stakeholder: WHO they are
 * (persona), WHAT role they play (role), WHERE they operate (context), and their TYPE classification.
 * Without these fields, stakeholders are incomplete and AI systems cannot properly model or understand them.
 *
 * Required fields enable AI to:
 * 1. **Understand stakeholder identity** - Type and role define who the stakeholder is
 * 2. **Link to persona** - Persona provides underlying characteristics and behaviors
 * 3. **Define context** - Context provides the business environment where stakeholder operates
 * 4. **Model relationships** - Core fields enable relationship and dependency modeling
 *
 * Missing required fields means stakeholders cannot be properly integrated into the context engineering model.
 *
 * **What it checks:**
 * - Stakeholders have `type` field (StakeholderType)
 * - Stakeholders have `role` field (string)
 * - Stakeholders have `persona` field (reference to @Persona)
 * - Stakeholders have `context` field (reference to @Context)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - All required fields present
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   persona: TechSavvyMillennial,
 *   context: InvestmentManagementContext
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - Missing required fields
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing persona and context
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingType'
  | 'missingRole'
  | 'missingPersona'
  | 'missingContext';

export const stakeholderRequiredFields = createRule<[], MessageIds>({
  name: 'stakeholder-required-fields',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Stakeholders must have all required fields: type, role, persona, and context. These fields define the fundamental identity of a stakeholder.',
    },
    messages: {
      missingType:
        "Stakeholder is missing required 'type' field. Type (StakeholderType.Human, StakeholderType.Team, StakeholderType.Organization, StakeholderType.System) defines the fundamental classification of the stakeholder. Add a type field to specify the stakeholder type.",
      missingRole:
        "Stakeholder is missing required 'role' field. Role defines the specific role this stakeholder plays within the context (e.g., 'Primary Investor', 'Risk Analyst', 'Email Validation Service'). Add a role field with a clear, business-meaningful name.",
      missingPersona:
        "Stakeholder '{{name}}' is missing required 'persona' field. Persona links the stakeholder to their underlying identity and characteristics. Even systems have personas! Add a persona field referencing a class decorated with @Persona (e.g., 'persona: TechSavvyMillennial').",
      missingContext:
        "Stakeholder '{{name}}' is missing required 'context' field. Context defines the business environment where this stakeholder operates. Add a context field referencing a class decorated with @Context (e.g., 'context: InvestmentManagementContext').",
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
          const type = decorator.metadata.type;
          const role = decorator.metadata.role;
          const persona = decorator.metadata.persona;
          const contextField = decorator.metadata.context;

          // Check for missing type
          if (!type) {
            context.report({
              node: decorator.node,
              messageId: 'missingType',
            });
          }

          // Check for missing role
          if (!role) {
            context.report({
              node: decorator.node,
              messageId: 'missingRole',
            });
          }

          // Check for missing persona
          if (!persona) {
            context.report({
              node: decorator.node,
              messageId: 'missingPersona',
              data: { name },
            });
          }

          // Check for missing context
          if (!contextField) {
            context.report({
              node: decorator.node,
              messageId: 'missingContext',
              data: { name },
            });
          }
        }
      },
    };
  },
});

