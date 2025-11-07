/**
 * Metric Owner Assignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **metric ownership** ensures accountability and responsibility
 * for metric tracking and improvement. Metrics without owners become orphaned - no one is
 * responsible for monitoring, improving, or maintaining them. Ownership enables AI systems
 * to route questions, generate reports, and ensure metrics are actively managed.
 *
 * Metric ownership enables AI to:
 * 1. **Route questions** - Know who to contact about metric status or issues
 * 2. **Generate reports** - Create owner-specific metric dashboards
 * 3. **Ensure accountability** - Track which metrics have active owners
 * 4. **Facilitate collaboration** - Connect stakeholders with metric owners
 *
 * Missing owners mean AI can't route questions or ensure metric accountability.
 *
 * **What it checks:**
 * - Metric decorators have an `owner` field
 * - Owner is a non-empty string
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Owner specified
 * @Metric({
 *   name: 'Net Promoter Score',
 *   owner: 'Michael Santos, Chief Customer Officer'
 * })
 * export class NPSMetric {}
 *
 * // ❌ Bad - Missing owner
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing owner - who is responsible?
 * })
 * export class NPSMetric {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingOwner' | 'emptyOwner';

export const metricOwnerAssignment = createRule<[], MessageIds>({
  name: 'metric-owner-assignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics should have owners to ensure accountability and enable proper routing of questions and reports',
    },
    messages: {
      missingOwner: "Metric '{{name}}' is missing an 'owner' field. Metrics need clear ownership to ensure accountability and enable AI systems to route questions, generate owner-specific reports, and track metric management. Add an owner field with the person or team responsible (e.g., 'owner: \"Michael Santos, Chief Customer Officer\"' or 'owner: \"Product Analytics Team\"').",
      emptyOwner: "Metric '{{name}}' has an empty owner field. Metrics need non-empty owner values to ensure accountability. Add a valid owner name or team name.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Metric decorators
          if (decorator.type !== 'Metric') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const owner = decorator.metadata.owner as string | undefined;

          if (!owner) {
            context.report({
              node: decorator.node,
              messageId: 'missingOwner',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          } else if (typeof owner === 'string' && owner.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyOwner',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          }
        }
      },
    };
  },
});
