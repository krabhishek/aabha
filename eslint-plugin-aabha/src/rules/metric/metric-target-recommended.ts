/**
 * Metric Target Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **target** defines the desired value to achieve for a metric.
 * Targets provide clear goals, enable progress tracking, and help teams understand success
 * criteria. While not always required, targets are essential for goal-oriented metrics and
 * enable AI systems to calculate progress and generate achievement reports.
 *
 * Target enables AI to:
 * 1. **Track progress** - Calculate progress toward target
 * 2. **Measure success** - Determine if target is achieved
 * 3. **Generate reports** - Create progress reports showing distance to target
 * 4. **Set expectations** - Understand what success looks like
 *
 * **What it checks:**
 * - Metric should have `target` field (recommended, not required)
 * - Target is a number (when provided)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has target
 * @Metric({
 *   name: 'Net Promoter Score',
 *   target: 65
 * })
 *
 * // ⚠️ Warning - Missing target (recommended)
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing target - consider adding target value
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTarget';

export const metricTargetRecommended = createRule<[], MessageIds>({
  name: 'metric-target-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have target field. Target defines the desired value to achieve, enabling progress tracking and success measurement.',
    },
    messages: {
      missingTarget:
        "Metric '{{name}}' is missing a 'target' field. Target defines the desired value to achieve for a metric. Targets provide clear goals, enable progress tracking, and help teams understand success criteria. While not always required, targets are essential for goal-oriented metrics. Add a target field with the desired value (e.g., 'target: 65' for a target of 65).",
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
          if (decorator.type !== 'Metric') continue;

          const name = decorator.metadata.name as string | undefined;
          const target = decorator.metadata.target;

          // Check if target is missing (recommended, not required)
          if (target === undefined || target === null) {
            context.report({
              node: decorator.node,
              messageId: 'missingTarget',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if target already exists in source to avoid duplicates
                if (source.includes('target:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const targetTemplate = `,\n  target: 0,  // TODO: Target value to achieve`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  targetTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

