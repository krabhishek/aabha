/**
 * Persona Behavior Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, behavior patterns capture how personas actually
 * act and interact with products/services. Understanding behavior is essential for designing
 * experiences that match how personas naturally operate. Without behavior patterns, personas
 * are static descriptions without actionable insights.
 *
 * Behavior patterns enable AI to:
 * 1. **Design for actual usage** - Understand how personas really use products
 * 2. **Predict interactions** - Anticipate when and how personas will engage
 * 3. **Optimize workflows** - Align features with natural behavior patterns
 * 4. **Create realistic scenarios** - Build day-in-the-life narratives
 *
 * **What it checks:**
 * - Personas should have behavior field with typicalBehaviors or usagePatterns
 * - Behavior should include observable patterns, not just goals
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has behavior patterns
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   behavior: {
 *     typicalBehaviors: ['Checks balance daily on mobile', 'Never visits branches'],
 *     usagePatterns: ['Daily active user', 'Multiple logins per day']
 *   }
 * })
 *
 * // ❌ Bad - Missing behavior
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing behavior patterns
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingBehavior' | 'emptyBehavior';

export const personaBehaviorRequired = createRule<[], MessageIds>({
  name: 'persona-behavior-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Personas should have behavior field with observable patterns. Behavior patterns capture how personas actually act and enable design decisions that match natural usage.',
    },
    messages: {
      missingBehavior:
        "Persona '{{personaName}}' is missing behavior field. In context engineering, behavior patterns capture how personas actually act and interact with products/services. Understanding behavior is essential for designing experiences that match how personas naturally operate. Add a 'behavior' object with typicalBehaviors and/or usagePatterns.",
      emptyBehavior:
        "Persona '{{personaName}}' has behavior field but it's empty. Behavior should include observable patterns like typicalBehaviors (day-to-day habits) and usagePatterns (how they use products/services). Add meaningful behavior patterns.",
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
          const behavior = decorator.metadata.behavior as
            | {
                typicalBehaviors?: string[];
                usagePatterns?: string[];
                [key: string]: unknown;
              }
            | undefined;
          const usagePatterns = decorator.metadata.usagePatterns as string[] | undefined;

          // Check if behavior is missing (and no top-level usagePatterns)
          if (!behavior && !usagePatterns) {
            context.report({
              node: decorator.node,
              messageId: 'missingBehavior',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const behaviorTemplate = `,\n  behavior: {\n    typicalBehaviors: [''],  // TODO: Day-to-day habits and patterns\n    usagePatterns: ['']  // TODO: How this persona uses products/services\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  behaviorTemplate,
                );
              },
            });
            continue;
          }

          // Check if behavior exists but is empty
          if (behavior) {
            const hasTypicalBehaviors = behavior.typicalBehaviors && behavior.typicalBehaviors.length > 0;
            const hasUsagePatterns = behavior.usagePatterns && behavior.usagePatterns.length > 0;
            if (!hasTypicalBehaviors && !hasUsagePatterns) {
              context.report({
                node: decorator.node,
                messageId: 'emptyBehavior',
                data: {
                  personaName: personaName || 'Unknown',
                },
              });
            }
          }
        }
      },
    };
  },
});

