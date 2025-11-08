/**
 * Interaction Security Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **security** defines authentication, authorization,
 * encryption, and compliance requirements. For backend, external, and data layer interactions,
 * security configuration is essential for protecting sensitive data and ensuring compliance.
 *
 * Security configuration enables AI to:
 * 1. **Understand security requirements** - Know authentication and authorization needs
 * 2. **Generate secure code** - Create appropriate security implementations
 * 3. **Ensure compliance** - Understand compliance requirements (GDPR, PCI-DSS, etc.)
 * 4. **Plan encryption** - Know encryption requirements for data in transit and at rest
 *
 * Missing security configuration makes it harder to understand security requirements or generate
 * proper security implementations for backend/external/data interactions.
 *
 * **What it checks:**
 * - Backend, External, or Data layer interactions should have `security` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has security configuration
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   security: {
 *     authentication: 'oauth2',
 *     authorization: 'rbac',
 *     encryptionInTransit: { required: true, protocol: 'TLS 1.3' },
 *     compliance: ['GDPR', 'PCI-DSS']
 *   }
 * })
 *
 * // ⚠️ Warning - Missing security for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing security - unclear security requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingSecurity';

const SECURITY_REQUIRED_LAYERS = ['Backend', 'External', 'Data'];

export const interactionSecurityRecommended = createRule<[], MessageIds>({
  name: 'interaction-security-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend, External, and Data layer interactions should have security field. Security defines authentication, authorization, encryption, and compliance requirements.',
    },
    messages: {
      missingSecurity:
        "Interaction '{{name}}' with layer '{{layer}}' is missing a 'security' field. Security configuration is recommended for backend, external, and data layer interactions to define authentication, authorization, encryption, and compliance requirements. Consider adding security configuration (e.g., 'security: { authentication: \"oauth2\", authorization: \"rbac\", encryptionInTransit: { required: true, protocol: \"TLS 1.3\" } }').",
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
          const security = decorator.metadata.security;

          // Only check for Backend, External, or Data layers
          if (!layer || !SECURITY_REQUIRED_LAYERS.includes(layer)) continue;

          // Check if security is missing
          if (!security) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if security already exists in source to avoid duplicates
            if (source.includes('security:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingSecurity',
              data: {
                name: name || 'Unnamed interaction',
                layer,
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if security already exists in source to avoid duplicates
                if (source.includes('security:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const securityTemplate = needsComma
                  ? `,\n  security: {\n    authentication: 'oauth2',  // TODO: Choose authentication method (none, api-key, oauth2, jwt, mtls, saml)\n    authorization: 'rbac',  // TODO: Choose authorization model (none, rbac, abac, acl)\n    encryptionInTransit: { required: true, protocol: 'TLS 1.3' },\n    compliance: []  // TODO: Add compliance requirements (GDPR, PCI-DSS, HIPAA, etc.)\n  },  // TODO: Define security requirements`
                  : `\n  security: {\n    authentication: 'oauth2',  // TODO: Choose authentication method (none, api-key, oauth2, jwt, mtls, saml)\n    authorization: 'rbac',  // TODO: Choose authorization model (none, rbac, abac, acl)\n    encryptionInTransit: { required: true, protocol: 'TLS 1.3' },\n    compliance: []  // TODO: Add compliance requirements (GDPR, PCI-DSS, HIPAA, etc.)\n  },  // TODO: Define security requirements`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  securityTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

