/**
 * Collaboration Success Criteria Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **success criteria define what "done" means** for a
 * collaboration. Without clear success criteria, participants don't know what they're working toward,
 * and there's no objective way to evaluate whether the collaboration achieved its purpose.
 *
 * Missing success criteria cause:
 * - **Unclear objectives** - Participants don't know what constitutes success
 * - **Endless meetings** - No clear end point, discussions drag on indefinitely
 * - **Misaligned expectations** - Different stakeholders have different success definitions
 * - **No evaluation** - Can't measure or improve collaboration effectiveness
 *
 * Explicit success criteria enable:
 * 1. **Clear objectives** - Everyone knows what the collaboration must achieve
 * 2. **Focused discussions** - Conversations stay on track toward defined outcomes
 * 3. **Objective evaluation** - Can measure whether collaboration was successful
 * 4. **AI facilitation** - AI can guide discussions toward success criteria
 * 5. **Continuous improvement** - Track success rates and identify improvement opportunities
 *
 * **What it checks:**
 * - Collaborations define success criteria
 * - Success criteria are measurable and specific
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear success criteria
 * @Collaboration({
 *   name: 'Sprint Planning',
 *   successCriteria: [
 *     'All high-priority stories estimated',
 *     'Sprint goal defined and agreed upon',
 *     'Team commits to sprint capacity'
 *   ]
 * })
 *
 * @Collaboration({
 *   name: 'Design Review',
 *   successCriteria: [
 *     'Design approved by stakeholders',
 *     'Technical feasibility confirmed',
 *     'Timeline agreed upon'
 *   ]
 * })
 *
 * // ❌ Bad - No success criteria
 * @Collaboration({
 *   name: 'Team Sync'  // What makes this sync successful?
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingSuccessCriteria';

export const collaborationSuccessCriteria = createRule<[], MessageIds>({
  name: 'collaboration-success-criteria',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaborations should define success criteria. In context engineering, success criteria help participants understand objectives, guide focused discussions, and enable objective evaluation of collaboration effectiveness.',
    },
    messages: {
      missingSuccessCriteria: "Collaboration '{{collaborationName}}' has no success criteria defined. In context engineering, success criteria define what 'done' means - they help participants understand objectives, keep discussions focused, and enable objective evaluation. Without success criteria, collaborations often become unfocused, run long, or leave participants unsure if they achieved their purpose. Specify what constitutes a successful collaboration (e.g., 'Decision made on vendor', 'Design approved', 'All stories estimated', 'Agreement on timeline').",
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
          if (decorator.type !== 'Collaboration') continue;

          const collaborationName = decorator.metadata.name as string | undefined;
          const successCriteria = decorator.metadata.successCriteria as unknown[] | undefined;

          if (!successCriteria || successCriteria.length === 0) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingSuccessCriteria',
              data: {
                collaborationName: collaborationName || 'Unknown',
              },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the last property to insert after
                const properties = arg.properties;
                if (properties.length === 0) return null;

                const lastProperty = properties[properties.length - 1];
                const indentation = detectIndentation(lastProperty, sourceCode);
                const insertPosition = lastProperty.range[1];

                // Add successCriteria with TODO comment
                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}successCriteria: [\n${indentation}  'TODO: Define success criteria (e.g., Decision made, Design approved, Agreement reached)'\n${indentation}]`
                );
              },
            });
          }
        }
      },
    };
  },
});
