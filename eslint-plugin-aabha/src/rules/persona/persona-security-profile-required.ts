/**
 * Persona Security Profile Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, security profiles document security and compliance
 * characteristics for personas. This is particularly relevant for System personas but can apply
 * to all types (Teams have security practices, Organizations have certifications, Humans have
 * clearance levels). Without security profiles, teams cannot understand security requirements,
 * compliance needs, or risk factors.
 *
 * Security profiles enable AI to:
 * 1. **Understand security requirements** - Know data classification, encryption, access control
 * 2. **Plan compliance** - Understand compliance requirements and certifications
 * 3. **Assess risk** - Know security risks and incident response capabilities
 * 4. **Design securely** - Build security into designs from the start
 *
 * **What it checks:**
 * - System personas should have securityProfile field documented
 * - Security profile should include key fields: dataClassification, accessControl, complianceRequirements
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has security profile
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   securityProfile: {
 *     dataClassification: 'Confidential (customer email data)',
 *     accessControl: 'API key (Bearer token), rate limiting',
 *     complianceRequirements: ['GDPR', 'SOC 2 Type II']
 *   }
 * })
 *
 * // ⚠️ Warning - Missing security profile
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service'
 *   // Missing securityProfile
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingSecurityProfile' | 'incompleteSecurityProfile';

export const personaSecurityProfileRequired = createRule<[], MessageIds>({
  name: 'persona-security-profile-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System personas should have securityProfile field. Security profiles document security and compliance characteristics, which are critical for System personas.',
    },
    messages: {
      missingSecurityProfile:
        "System persona '{{personaName}}' should have securityProfile field. In context engineering, security profiles document security and compliance characteristics. For System personas, this is particularly important as they handle data and have security requirements. Add a 'securityProfile' object with dataClassification, accessControl, and complianceRequirements (e.g., 'securityProfile: {{ dataClassification: \"Confidential\", accessControl: \"API key authentication\", complianceRequirements: [\"GDPR\", \"SOC 2\"] }}').",
      incompleteSecurityProfile:
        "System persona '{{personaName}}' has securityProfile but missing key fields. Security profiles should include dataClassification, accessControl, and complianceRequirements to provide complete security documentation. Add missing fields: {{missingFields}}.",
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
          if (typeNormalized !== 'system') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const securityProfile = decorator.metadata.securityProfile as
            | {
                dataClassification?: string;
                accessControl?: string;
                complianceRequirements?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Check if securityProfile is missing
          if (!securityProfile) {
            context.report({
              node: decorator.node,
              messageId: 'missingSecurityProfile',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if securityProfile already exists in source to avoid duplicates
                if (source.includes('securityProfile:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const securityProfileTemplate = `,\n  securityProfile: {\n    dataClassification: '',  // TODO: Sensitivity level of data handled\n    accessControl: '',  // TODO: How access is controlled and authenticated\n    complianceRequirements: ['']  // TODO: Regulatory and compliance standards\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  securityProfileTemplate,
                );
              },
            });
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];
          if (!securityProfile.dataClassification) {
            missingFields.push('dataClassification');
          }
          if (!securityProfile.accessControl) {
            missingFields.push('accessControl');
          }
          if (!securityProfile.complianceRequirements || securityProfile.complianceRequirements.length === 0) {
            missingFields.push('complianceRequirements');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteSecurityProfile',
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

