/**
 * Persona System Attributes Rule
 *
 * **Why this rule exists:**
 * System personas represent technical services, APIs, and external systems. In context engineering,
 * system personas need technical attributes (vendor, capabilities, SLA, authentication) to document
 * integration requirements and dependencies. Without system attributes, teams cannot understand
 * technical constraints, SLA commitments, or integration patterns.
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingSystemAttributes';

export const personaSystemAttributes = createRule<[], MessageIds>({
  name: 'persona-system-attributes',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System personas should have systemAttributes. In context engineering, system attributes document technical characteristics, SLAs, and integration requirements.',
    },
    messages: {
      missingSystemAttributes:
        "System persona '{{personaName}}' lacks systemAttributes. In context engineering, system personas represent APIs, services, and technical components that need technical documentation. Add systemAttributes with vendor, capabilities, SLA, authentication, integration details. Example: systemAttributes: {{ vendor: 'SendGrid', capabilities: ['Email validation', 'Deliverability scoring'], sla: {{ availability: '99.9%', latency: '< 200ms p95' }}, authentication: 'API key (Bearer token)', integration: 'RESTful API with JSON' }}. Without systemAttributes, teams cannot understand technical constraints or integration requirements.",
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
          if (typeNormalized !== 'system') continue; // Only validate for system personas

          const personaName = decorator.metadata.name as string | undefined;
          const systemAttributes = decorator.metadata.systemAttributes as object | undefined;

          // Check if systemAttributes is missing
          if (!systemAttributes || Object.keys(systemAttributes).length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingSystemAttributes',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const systemAttributesTemplate = `,\n  systemAttributes: {\n    vendor: '', // TODO: Who provides this system/service?\n    capabilities: [''], // TODO: What can this system do?\n    authentication: '', // TODO: How do we authenticate? (API key, OAuth, mTLS)\n    integration: '' // TODO: How do we integrate? (REST API, GraphQL, gRPC)\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  systemAttributesTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});
