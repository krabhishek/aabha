/**
 * Persona Pain Points Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, pain points identify problems, frustrations, and
 * obstacles that personas experience. Understanding pain points is essential for designing
 * solutions that address real problems. Without pain points, personas become idealized
 * representations without actionable design opportunities.
 *
 * Pain points enable AI to:
 * 1. **Identify opportunities** - Problems reveal where to focus design efforts
 * 2. **Prioritize features** - Pain points guide feature prioritization
 * 3. **Create value propositions** - Solutions that address pain points create value
 * 4. **Design empathetically** - Understanding frustrations enables better UX
 *
 * **What it checks:**
 * - Personas should have painPoints field with meaningful frustrations
 * - Pain points should be specific and actionable
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has pain points
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   painPoints: [
 *     'Traditional banks feel old and slow',
 *     'Poor mobile app experience'
 *   ]
 * })
 *
 * // ❌ Bad - Missing pain points
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing pain points
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPainPoints' | 'emptyPainPoints';

export const personaPainPointsRequired = createRule<[], MessageIds>({
  name: 'persona-pain-points-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Personas should have painPoints field with meaningful frustrations. Pain points identify problems and obstacles that enable design opportunities.',
    },
    messages: {
      missingPainPoints:
        "Persona '{{personaName}}' is missing painPoints field. In context engineering, pain points identify problems, frustrations, and obstacles that personas experience. Understanding pain points is essential for designing solutions that address real problems. Without pain points, personas become idealized representations without actionable design opportunities. Add a 'painPoints' array with specific frustrations and obstacles.",
      emptyPainPoints:
        "Persona '{{personaName}}' has painPoints field but it's empty. Pain points should be specific and actionable (e.g., 'Traditional banks feel old and slow', 'Poor mobile app experience', 'Lack of financial guidance'). Add meaningful pain points that reveal design opportunities.",
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
          const painPoints = decorator.metadata.painPoints as string[] | undefined;

          // Check if painPoints is missing
          if (!painPoints) {
            context.report({
              node: decorator.node,
              messageId: 'missingPainPoints',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const painPointsTemplate = `,\n  painPoints: [\n    '', // TODO: Problems, frustrations, and obstacles this persona experiences\n    '' // TODO: Add more pain points\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  painPointsTemplate,
                );
              },
            });
            continue;
          }

          // Check if painPoints is empty
          if (painPoints.length === 0 || painPoints.every((p) => typeof p === 'string' && p.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyPainPoints',
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

