/**
 * Interaction Organizational Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **organizationalConfig** provides organizational-specific
 * configuration for organization-to-organization interactions. For Organizational layer interactions,
 * organizationalConfig is essential for understanding interaction type, organizations involved, legal
 * framework, formal agreements, compliance requirements, and other organizational-specific details.
 *
 * Organizational config enables AI to:
 * 1. **Understand interaction type** - Know formal agreement, regulatory submission, audit, etc.
 * 2. **Manage organizations** - Know which organizations are involved and their roles
 * 3. **Plan legal framework** - Understand jurisdiction and governing law
 * 4. **Enable compliance** - Understand compliance requirements and regulatory bodies
 *
 * Missing organizationalConfig makes it harder to understand organizational requirements or generate
 * proper coordination code for Organizational interactions.
 *
 * **What it checks:**
 * - Organizational layer interactions should have `organizationalConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has organizational config
 * @Interaction({
 *   name: 'Partnership Agreement',
 *   layer: InteractionLayer.Organizational,
 *   organizationalConfig: {
 *     interactionType: 'formal-agreement',
 *     organizations: [
 *       { organization: BankOrganization, role: 'service-provider' },
 *       { organization: VendorOrganization, role: 'vendor' }
 *     ],
 *     legalFramework: {
 *       jurisdiction: 'State of California, USA'
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing organizational config for organizational interaction
 * @Interaction({
 *   name: 'Partnership Agreement',
 *   layer: InteractionLayer.Organizational
 *   // Missing organizationalConfig - unclear organizational requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingOrganizationalConfig';

export const interactionOrganizationalConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-organizational-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Organizational layer interactions should have organizationalConfig field. Organizational config provides organizational-specific configuration for organization-to-organization interactions.',
    },
    messages: {
      missingOrganizationalConfig:
        "Interaction '{{name}}' with layer 'Organizational' is missing an 'organizationalConfig' field. Organizational config is recommended for Organizational layer interactions to define interaction type, organizations involved, legal framework, formal agreements, compliance requirements, and other organizational-specific details. Consider adding organizational config (e.g., 'organizationalConfig: { interactionType: \"formal-agreement\", organizations: [...] }').",
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
          if (decorator.type !== 'Interaction') continue;

          const name = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;
          const organizationalConfig = decorator.metadata.organizationalConfig;

          // Only check for Organizational layer
          if (layer !== 'Organizational') continue;

          // Check if organizationalConfig is missing
          if (!organizationalConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if organizationalConfig already exists in source to avoid duplicates
            if (source.includes('organizationalConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingOrganizationalConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if organizationalConfig already exists in source to avoid duplicates
                if (source.includes('organizationalConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const organizationalConfigTemplate = needsComma
                  ? `,\n  organizationalConfig: {\n    interactionType: 'formal-agreement',  // TODO: Choose interaction type (formal-agreement, regulatory-submission, audit, partnership)\n    organizations: [],  // TODO: Add organizations with roles\n    legalFramework: {\n      jurisdiction: ''  // TODO: Define legal jurisdiction\n    }\n  },  // TODO: Define organizational configuration`
                  : `\n  organizationalConfig: {\n    interactionType: 'formal-agreement',  // TODO: Choose interaction type (formal-agreement, regulatory-submission, audit, partnership)\n    organizations: [],  // TODO: Add organizations with roles\n    legalFramework: {\n      jurisdiction: ''  // TODO: Define legal jurisdiction\n    }\n  },  // TODO: Define organizational configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  organizationalConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

