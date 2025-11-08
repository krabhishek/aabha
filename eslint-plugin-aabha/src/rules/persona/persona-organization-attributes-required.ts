/**
 * Persona Organization Attributes Required Rule
 *
 * **Why this rule exists:**
 * Organization personas represent companies, departments, regulatory bodies, and partners. In context
 * engineering, organization personas need organization-specific attributes (legalName, organizationType,
 * industry, size, relationship) to document business relationships, compliance requirements, and
 * organizational context. Without organization attributes, teams cannot understand business relationships,
 * regulatory obligations, or partnership structures.
 *
 * Organization attributes enable AI to:
 * 1. **Understand relationships** - Legal name and relationship type clarify business connections
 * 2. **Assess compliance** - Industry and jurisdiction affect regulatory requirements
 * 3. **Plan engagements** - Size and structure inform engagement models
 * 4. **Document partnerships** - Contract types and services clarify partnership scope
 *
 * **What it checks:**
 * - Organization personas should have organizationAttributes field defined
 * - Organization attributes should include key fields (legalName or organizationType, industry, relationship)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has organization attributes
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'External Auditor',
 *   organizationAttributes: {
 *     legalName: 'KPMG Genai LLP',
 *     organizationType: 'Audit firm',
 *     industry: 'Professional Services - Audit & Assurance',
 *     relationship: 'External service provider'
 *   }
 * })
 *
 * // ❌ Bad - Missing organization attributes
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'External Auditor'
 *   // Missing organizationAttributes
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingOrganizationAttributes' | 'incompleteOrganizationAttributes';

export const personaOrganizationAttributesRequired = createRule<[], MessageIds>({
  name: 'persona-organization-attributes-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Organization personas should have organizationAttributes field with key information. Organization attributes document business relationships, compliance requirements, and organizational context.',
    },
    messages: {
      missingOrganizationAttributes:
        "Organization persona '{{personaName}}' is missing organizationAttributes field. In context engineering, organization personas represent companies, departments, regulatory bodies, and partners that need organizational documentation. Add organizationAttributes with legalName (or organizationType), industry, relationship, and other relevant fields. Without organizationAttributes, teams cannot understand business relationships, regulatory obligations, or partnership structures.",
      incompleteOrganizationAttributes:
        "Organization persona '{{personaName}}' has organizationAttributes but missing key fields. Organization attributes should include legalName (or organizationType), industry, and relationship to provide essential context. Add missing fields: {{missingFields}}.",
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
                legalName?: string;
                organizationType?: string;
                industry?: string;
                relationship?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Check if organizationAttributes is missing
          if (!organizationAttributes) {
            context.report({
              node: decorator.node,
              messageId: 'missingOrganizationAttributes',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const organizationAttributesTemplate = `,\n  organizationAttributes: {\n    legalName: '',  // TODO: Official registered legal name\n    organizationType: '',  // TODO: Type of organization (e.g., 'Regulatory body', 'Strategic partner')\n    industry: '',  // TODO: Industry or sector\n    relationship: ''  // TODO: Nature of business relationship\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  organizationAttributesTemplate,
                );
              },
            });
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];
          if (!organizationAttributes.legalName && !organizationAttributes.organizationType) {
            missingFields.push('legalName or organizationType');
          }
          if (!organizationAttributes.industry) {
            missingFields.push('industry');
          }
          if (!organizationAttributes.relationship) {
            missingFields.push('relationship');
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

