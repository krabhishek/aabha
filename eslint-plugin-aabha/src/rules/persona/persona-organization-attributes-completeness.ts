/**
 * Persona Organization Attributes Completeness Rule
 *
 * **Why this rule exists:**
 * Organization personas represent companies, departments, regulatory bodies, and partners. While
 * organizationAttributes may exist with basic required fields, they should include additional
 * recommended fields (size, headquarters, jurisdiction, complianceRequirements, keyContacts) to
 * provide complete organizational context. Incomplete organization attributes leave teams without
 * critical information needed for relationship management, compliance planning, and engagement
 * strategies.
 *
 * Organization attributes completeness enables AI to:
 * 1. **Plan engagements** - Size and structure inform engagement models and resource needs
 * 2. **Assess compliance** - Jurisdiction and complianceRequirements affect regulatory obligations
 * 3. **Manage relationships** - KeyContacts and contractType clarify engagement structure
 * 4. **Understand scope** - Headquarters and jurisdiction define geographic and legal scope
 *
 * **What it checks:**
 * - Organization personas with organizationAttributes should include recommended fields
 * - Recommended fields: size, headquarters, jurisdiction, complianceRequirements, keyContacts
 * - These fields provide essential context beyond the minimum required fields
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete organization attributes
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'External Auditor',
 *   organizationAttributes: {
 *     legalName: 'KPMG Genai LLP',
 *     organizationType: 'Audit firm',
 *     industry: 'Professional Services - Audit & Assurance',
 *     relationship: 'External service provider',
 *     size: 'Enterprise (2,500 employees in Genai, 245,000 globally)',
 *     headquarters: 'Capital City, Genai',
 *     jurisdiction: 'Global',
 *     complianceRequirements: ['SOC 2 Type II certification', 'GDPR compliance'],
 *     keyContacts: ['Alice Johnson - Engagement Partner', 'Bob Williams - Senior Manager']
 *   }
 * })
 *
 * // ⚠️ Warning - Incomplete organization attributes
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'External Auditor',
 *   organizationAttributes: {
 *     legalName: 'KPMG Genai LLP',
 *     industry: 'Professional Services',
 *     relationship: 'External service provider'
 *     // Missing size, headquarters, jurisdiction, complianceRequirements, keyContacts
 *   }
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteOrganizationAttributes';

export const personaOrganizationAttributesCompleteness = createRule<[], MessageIds>({
  name: 'persona-organization-attributes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Organization personas with organizationAttributes should include recommended fields. Complete organization attributes provide essential context for relationship management, compliance planning, and engagement strategies.',
    },
    messages: {
      incompleteOrganizationAttributes:
        "Organization persona '{{personaName}}' has organizationAttributes but missing recommended fields. Organization attributes should include size, headquarters, jurisdiction, complianceRequirements, and keyContacts to provide complete organizational context. Add missing fields: {{missingFields}}. Without these fields, teams lack critical information needed for relationship management, compliance planning, and engagement strategies.",
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
          if (decorator.type !== 'Persona') continue;

          const personaType = decorator.metadata.type as string | undefined;
          // Normalize personaType to handle both enum values and enum references
          const typeNormalized = personaType?.toLowerCase().replace('personatype.', '') || '';
          if (typeNormalized !== 'organization') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const organizationAttributes = decorator.metadata.organizationAttributes as
            | {
                size?: string;
                headquarters?: string;
                jurisdiction?: string;
                complianceRequirements?: string[];
                keyContacts?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Only check if organizationAttributes exists (missing is handled by persona-organization-attributes-required rule)
          if (!organizationAttributes || Object.keys(organizationAttributes).length === 0) {
            continue;
          }

          // Check for recommended missing fields
          const missingFields: string[] = [];

          // Size helps understand organization scale
          if (!organizationAttributes.size) {
            missingFields.push('size');
          }

          // Headquarters provides geographic context
          if (!organizationAttributes.headquarters) {
            missingFields.push('headquarters');
          }

          // Jurisdiction defines legal/geographic scope
          if (!organizationAttributes.jurisdiction) {
            missingFields.push('jurisdiction');
          }

          // ComplianceRequirements are critical for regulatory organizations
          if (!organizationAttributes.complianceRequirements || organizationAttributes.complianceRequirements.length === 0) {
            missingFields.push('complianceRequirements');
          }

          // KeyContacts enable relationship management
          if (!organizationAttributes.keyContacts || organizationAttributes.keyContacts.length === 0) {
            missingFields.push('keyContacts');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteOrganizationAttributes',
              data: {
                personaName: personaName || 'Unknown',
                missingFields: missingFields.join(', '),
              },
            });
          }
        }
      },
    };
  },
});

