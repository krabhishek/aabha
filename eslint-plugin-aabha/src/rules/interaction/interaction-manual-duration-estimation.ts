/**
 * Interaction Manual Duration Estimation Rule
 *
 * **Why this rule exists:**
 * Manual processes require duration estimates for resource planning, SLA compliance, and
 * customer expectations. Without estimates, teams cannot plan capacity or meet commitments.
 *
 * **What it checks:**
 * - Manual layer interactions should have estimatedDuration specified
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDuration';

export const interactionManualDurationEstimation = createRule<[], MessageIds>({
  name: 'interaction-manual-duration-estimation',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Manual layer interactions should have estimatedDuration. In context engineering, duration estimates enable capacity planning and SLA compliance.',
    },
    messages: {
      missingDuration:
        "Interaction '{{interactionName}}' is Manual layer but lacks estimatedDuration. Add manualConfig.estimatedDuration in ISO 8601 format. Examples: 'PT2H' (2 hours), 'PT24H' (1 day), 'PT48H' (2 days).",
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

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          if (layer !== 'Manual') continue;

          const manualConfig = decorator.metadata.manualConfig as { estimatedDuration?: string } | undefined;

          if (!manualConfig?.estimatedDuration) {
            context.report({
              node: decorator.node,
              messageId: 'missingDuration',
              data: { interactionName: interactionName || 'Unknown' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const manualConfigMatch = source.match(/manualConfig:\s*{/);
                if (!manualConfigMatch) return null;

                const insertIndex = manualConfigMatch.index! + manualConfigMatch[0].length;
                const insertion = `\n      estimatedDuration: 'PT2H', // TODO: Adjust duration (PT2H=2hr, PT24H=1day, PT48H=2days)`;
                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  insertion,
                );
              },
            });
          }
        }
      },
    };
  },
});
