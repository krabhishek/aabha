/**
 * Persona System Adoption Barriers Rule
 *
 * **Why this rule exists:**
 * System personas represent technical services, APIs, and external systems. Adoption barriers
 * identify technical, organizational, or practical obstacles to adopting or integrating these
 * systems. Understanding adoption barriers helps teams anticipate challenges, plan mitigation
 * strategies, and make informed decisions about system integration. This is particularly important
 * for System personas as they often represent external dependencies.
 *
 * Adoption barriers enable AI to:
 * 1. **Anticipate challenges** - Identify potential obstacles before integration
 * 2. **Plan mitigation** - Develop strategies to address barriers proactively
 * 3. **Assess risk** - Understand complexity and risk factors
 * 4. **Make informed decisions** - Evaluate whether integration is worth the barriers
 *
 * **What it checks:**
 * - System personas should have adoptionBarriers field (recommended, not required)
 * - Adoption barriers should be specific and actionable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has adoption barriers
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   adoptionBarriers: [
 *     'Complex API integration required',
 *     'High latency concerns',
 *     'Vendor lock-in risk'
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing adoption barriers (recommended but not required)
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service'
 *   // Missing adoptionBarriers - consider documenting obstacles
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingAdoptionBarriers' | 'emptyAdoptionBarriers';

export const personaSystemAdoptionBarriers = createRule<[], MessageIds>({
  name: 'persona-system-adoption-barriers',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System personas should document adoptionBarriers. Adoption barriers identify obstacles to adopting or integrating systems, helping teams anticipate challenges and plan mitigation strategies.',
    },
    messages: {
      missingAdoptionBarriers:
        "System persona '{{personaName}}' is missing adoptionBarriers field. In context engineering, adoption barriers identify technical, organizational, or practical obstacles to adopting or integrating systems. Understanding adoption barriers helps teams anticipate challenges, plan mitigation strategies, and make informed decisions about system integration. For System personas, documenting adoption barriers is recommended. Add an 'adoptionBarriers' array with specific obstacles (e.g., 'Complex API integration required', 'High latency concerns', 'Vendor lock-in risk').",
      emptyAdoptionBarriers:
        "System persona '{{personaName}}' has adoptionBarriers field but it's empty. Adoption barriers should be specific and actionable (e.g., 'Complex API integration required', 'High latency concerns', 'Steep learning curve', 'Expensive at scale'). Add meaningful adoption barriers that help teams anticipate integration challenges.",
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
          const adoptionBarriers = decorator.metadata.adoptionBarriers as string[] | undefined;

          // Check if adoptionBarriers is missing
          if (!adoptionBarriers) {
            context.report({
              node: decorator.node,
              messageId: 'missingAdoptionBarriers',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const adoptionBarriersTemplate = `,\n  adoptionBarriers: [\n    '', // TODO: Technical, organizational, or practical obstacles to adoption\n    '' // TODO: Add more adoption barriers (e.g., 'Complex API integration', 'High latency', 'Vendor lock-in')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  adoptionBarriersTemplate,
                );
              },
            });
            continue;
          }

          // Check if adoptionBarriers is empty
          if (adoptionBarriers.length === 0 || adoptionBarriers.every((b) => typeof b === 'string' && b.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyAdoptionBarriers',
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

