/**
 * Persona Preferred Channels Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, preferred channels define how personas prefer to
 * interact with products, services, or systems. This is critical for designing communication
 * strategies, touchpoints, and user experiences. Without preferred channels, teams cannot
 * design appropriate interaction patterns or choose the right communication mediums.
 *
 * Preferred channels enable AI to:
 * 1. **Design touchpoints** - Know which channels to use for engagement
 * 2. **Plan communication** - Choose appropriate communication mediums
 * 3. **Optimize experiences** - Focus on channels personas actually use
 * 4. **Allocate resources** - Invest in channels that matter to personas
 *
 * **What it checks:**
 * - Personas should have preferredChannels field defined
 * - Preferred channels should be meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has preferred channels
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   preferredChannels: ['mobile app', 'web banking', 'chat support']
 * })
 *
 * // ❌ Bad - Missing preferred channels
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing preferredChannels
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPreferredChannels' | 'emptyPreferredChannels';

export const personaPreferredChannelsRequired = createRule<[], MessageIds>({
  name: 'persona-preferred-channels-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have preferredChannels field. Preferred channels define how personas prefer to interact, helping teams design appropriate touchpoints and communication strategies.',
    },
    messages: {
      missingPreferredChannels:
        "Persona '{{personaName}}' is missing preferredChannels field. In context engineering, preferred channels define how personas prefer to interact with products, services, or systems. This is critical for designing communication strategies and touchpoints. Add a 'preferredChannels' array with channels in priority order (e.g., 'preferredChannels: [\"mobile app\", \"web banking\", \"chat support\"]' for Human personas, or 'preferredChannels: [\"REST API\", \"webhooks\", \"batch files\"]' for System personas).",
      emptyPreferredChannels:
        "Persona '{{personaName}}' has preferredChannels field but it's empty. Preferred channels should be meaningful and describe how this persona prefers to interact (e.g., 'mobile app', 'web banking', 'phone', 'in-person' for Human personas, or 'REST API', 'webhooks' for System personas). Add meaningful preferred channels.",
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

          const personaName = decorator.metadata.name as string | undefined;
          const preferredChannels = decorator.metadata.preferredChannels as string[] | undefined;

          // Check if preferredChannels is missing
          if (!preferredChannels) {
            context.report({
              node: decorator.node,
              messageId: 'missingPreferredChannels',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if preferredChannels already exists in source to avoid duplicates
                if (source.includes('preferredChannels:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const preferredChannelsTemplate = `,\n  preferredChannels: [\n    '', // TODO: How this persona prefers to interact (in priority order)\n    '' // TODO: Add more channels (e.g., 'mobile app', 'web banking', 'phone')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  preferredChannelsTemplate,
                );
              },
            });
            continue;
          }

          // Check if preferredChannels is empty
          if (preferredChannels.length === 0 || preferredChannels.every((c) => typeof c === 'string' && c.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyPreferredChannels',
              data: {
                personaName: personaName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});

