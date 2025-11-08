/**
 * Persona System Attributes Completeness Rule
 *
 * **Why this rule exists:**
 * System personas represent technical services, APIs, and external systems. While systemAttributes
 * may exist, they need to include essential fields (vendor, capabilities, authentication, integration)
 * to be useful for understanding technical constraints and integration requirements. Incomplete
 * system attributes leave teams without critical information needed for integration planning.
 *
 * System attributes completeness enables AI to:
 * 1. **Plan integrations** - Vendor and capabilities inform integration approach
 * 2. **Assess dependencies** - Authentication and integration patterns reveal complexity
 * 3. **Understand constraints** - SLA and rate limits affect system design
 * 4. **Document requirements** - Complete attributes serve as technical documentation
 *
 * **What it checks:**
 * - System personas with systemAttributes should include key fields
 * - Required fields: vendor (or capabilities), authentication (or integration)
 * - Recommended fields: capabilities, authentication, integration, SLA
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete system attributes
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   systemAttributes: {
 *     vendor: 'SendGrid',
 *     capabilities: ['Email validation', 'Deliverability scoring'],
 *     authentication: 'API key (Bearer token)',
 *     integration: 'RESTful API with JSON payloads'
 *   }
 * })
 *
 * // ❌ Bad - Incomplete system attributes
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   systemAttributes: {
 *     vendor: 'SendGrid'
 *     // Missing capabilities, authentication, integration
 *   }
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteSystemAttributes';

export const personaSystemAttributesCompleteness = createRule<[], MessageIds>({
  name: 'persona-system-attributes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System personas with systemAttributes should include essential fields. Complete system attributes document technical characteristics, SLAs, and integration requirements.',
    },
    messages: {
      incompleteSystemAttributes:
        "System persona '{{personaName}}' has systemAttributes but missing essential fields. System attributes should include vendor (or capabilities), capabilities, authentication (or integration), and integration to provide complete technical documentation. Add missing fields: {{missingFields}}. Without these fields, teams cannot fully understand technical constraints or integration requirements.",
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
          const systemAttributes = decorator.metadata.systemAttributes as
            | {
                vendor?: string;
                capabilities?: string[];
                authentication?: string;
                integration?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if systemAttributes exists (missing is handled by persona-system-attributes rule)
          if (!systemAttributes || Object.keys(systemAttributes).length === 0) {
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];
          
          // Vendor or capabilities should exist (at least one)
          if (!systemAttributes.vendor && (!systemAttributes.capabilities || systemAttributes.capabilities.length === 0)) {
            missingFields.push('vendor or capabilities');
          }
          
          // Capabilities is highly recommended
          if (!systemAttributes.capabilities || systemAttributes.capabilities.length === 0) {
            missingFields.push('capabilities');
          }
          
          // Authentication or integration should exist (at least one)
          if (!systemAttributes.authentication && !systemAttributes.integration) {
            missingFields.push('authentication or integration');
          }
          
          // Both authentication and integration are recommended
          if (!systemAttributes.authentication) {
            missingFields.push('authentication');
          }
          if (!systemAttributes.integration) {
            missingFields.push('integration');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteSystemAttributes',
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

