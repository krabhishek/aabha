/**
 * Persona Day in the Life Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, "day in the life" scenarios are narrative descriptions
 * that show how personas interact with products/services in context. These narratives make personas
 * memorable, help teams empathize, and provide concrete examples of persona behavior. For Human
 * personas especially, day-in-the-life scenarios bring personas to life and help teams understand
 * real-world usage patterns.
 *
 * Day in the life enables AI to:
 * 1. **Create empathy** - Narratives help teams understand persona experiences
 * 2. **Illustrate behavior** - Show how personas actually use products/services
 * 3. **Identify opportunities** - Reveal moments where products can add value
 * 4. **Make personas memorable** - Stories are more memorable than lists
 *
 * **What it checks:**
 * - Human personas should have dayInTheLife field (recommended, not required)
 * - Day in the life should be meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has day in the life
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   dayInTheLife: 'Marcus wakes up at 7 AM, checks his account balance on his phone while having coffee...'
 * })
 *
 * // ⚠️ Warning - Missing day in the life
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing dayInTheLife - consider adding narrative scenario
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDayInTheLife' | 'emptyDayInTheLife';

export const personaDayInTheLifeRecommended = createRule<[], MessageIds>({
  name: 'persona-day-in-the-life-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Human personas should have dayInTheLife field. Day-in-the-life scenarios are narrative descriptions that make personas memorable and help teams empathize with persona experiences.',
    },
    messages: {
      missingDayInTheLife:
        "Human persona '{{personaName}}' is missing dayInTheLife field. In context engineering, 'day in the life' scenarios are narrative descriptions showing how personas interact with products/services in context. These narratives make personas memorable, help teams empathize, and provide concrete examples of persona behavior. For Human personas, day-in-the-life scenarios are recommended. Add a 'dayInTheLife' field with a narrative description (e.g., 'dayInTheLife: \"Marcus wakes up at 7 AM, checks his account balance on his phone while having coffee...\"').",
      emptyDayInTheLife:
        "Human persona '{{personaName}}' has dayInTheLife field but it's empty. Day in the life should be a meaningful narrative describing a typical day for this persona, showing how they interact with products/services. Add a narrative description.",
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
          if (!personaType || personaType.toLowerCase().replace('personatype.', '') !== 'human') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const dayInTheLife = decorator.metadata.dayInTheLife as string | undefined;

          // Check if dayInTheLife is missing
          if (!dayInTheLife) {
            context.report({
              node: decorator.node,
              messageId: 'missingDayInTheLife',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if dayInTheLife already exists in source to avoid duplicates
                if (source.includes('dayInTheLife:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const dayInTheLifeTemplate = `,\n  dayInTheLife: '',  // TODO: Narrative describing a typical day for this persona, showing how they interact with products/services`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  dayInTheLifeTemplate,
                );
              },
            });
            continue;
          }

          // Check if dayInTheLife is empty
          if (typeof dayInTheLife === 'string' && dayInTheLife.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDayInTheLife',
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

