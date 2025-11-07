/**
 * Interaction Manual Approval Workflow Rule
 *
 * **Why this rule exists:**
 * Manual layer interactions involving reviews or approvals need defined workflows to ensure
 * accountability, audit trails, and process consistency. Without workflows, manual processes
 * become ad-hoc, untrackable, and non-compliant.
 *
 * **What it checks:**
 * - Manual layer interactions using manual-review pattern should have approvalWorkflow configured
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingWorkflow';

export const interactionManualApprovalWorkflow = createRule<[], MessageIds>({
  name: 'interaction-manual-approval-workflow',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Manual layer interactions with manual-review pattern should have approvalWorkflow. In context engineering, approval workflows ensure accountability and audit trails.',
    },
    messages: {
      missingWorkflow:
        "Interaction '{{interactionName}}' is Manual layer with manual-review pattern but lacks approvalWorkflow. Add manualConfig.approvalWorkflow with levels and description. Example: approvalWorkflow: {{ levels: 2, description: 'Manager then Director approval' }}.",
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
          const pattern = decorator.metadata.pattern as string | undefined;

          if (layer !== 'Manual' || pattern !== 'manual-review') continue;

          const manualConfig = decorator.metadata.manualConfig as { approvalWorkflow?: object } | undefined;

          if (!manualConfig?.approvalWorkflow) {
            context.report({
              node: decorator.node,
              messageId: 'missingWorkflow',
              data: { interactionName: interactionName || 'Unknown' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const manualConfigMatch = source.match(/manualConfig:\s*{/);
                if (!manualConfigMatch) return null;

                const insertIndex = manualConfigMatch.index! + manualConfigMatch[0].length;
                const insertion = `\n      approvalWorkflow: {\n        levels: 1, // TODO: Number of approval levels\n        description: '' // TODO: Describe workflow\n      },`;
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
