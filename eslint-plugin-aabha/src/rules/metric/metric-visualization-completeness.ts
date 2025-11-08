/**
 * Metric Visualization Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **visualization** defines how metrics are displayed and monitored.
 * When a visualization object is provided, it should include key fields like dashboardUrl or
 * visualizationType to enable proper metric visualization and monitoring. Incomplete visualization
 * objects lack the information needed to display and monitor metrics effectively.
 *
 * Visualization completeness enables AI to:
 * 1. **Display metrics** - Know how to visualize metric data
 * 2. **Configure dashboards** - Set up metric dashboards and charts
 * 3. **Enable monitoring** - Configure alerting and refresh intervals
 * 4. **Improve visibility** - Make metrics accessible to teams
 *
 * **What it checks:**
 * - If visualization exists, it should have at least dashboardUrl or visualizationType
 * - When alerting is provided, it should have enabled, channels, and conditions
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete visualization
 * @Metric({
 *   name: 'Net Promoter Score',
 *   visualization: {
 *     dashboardUrl: 'https://dashboard.company.com/nps',
 *     visualizationType: 'gauge',
 *     refreshInterval: '1h'
 *   }
 * })
 *
 * // ❌ Bad - Incomplete visualization
 * @Metric({
 *   name: 'Net Promoter Score',
 *   visualization: {
 *     // Missing dashboardUrl and visualizationType
 *   }
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteVisualization' | 'incompleteAlerting';

export const metricVisualizationCompleteness = createRule<[], MessageIds>({
  name: 'metric-visualization-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics with visualization field should have complete visualization objects. Visualization objects should include dashboardUrl or visualizationType to enable proper metric display and monitoring.',
    },
    messages: {
      incompleteVisualization:
        "Metric '{{name}}' has visualization object but missing key fields. Visualization objects should include at least 'dashboardUrl' (URL to dashboard) or 'visualizationType' (chart type) to enable proper metric display. Add dashboardUrl or visualizationType (e.g., 'dashboardUrl: \"https://dashboard.company.com/metric\"' or 'visualizationType: \"gauge\"').",
      incompleteAlerting:
        "Metric '{{name}}' has visualization with alerting but missing key fields. Alerting objects should include 'enabled' (boolean), 'channels' (array of notification channels), and 'conditions' (array of alert conditions). Add missing alerting fields.",
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
          const visualization = decorator.metadata.visualization as
            | {
                dashboardUrl?: string;
                visualizationType?: string;
                refreshInterval?: string;
                alerting?: {
                  enabled?: boolean;
                  channels?: string[];
                  conditions?: string[];
                  [key: string]: unknown;
                };
                [key: string]: unknown;
              }
            | undefined;

          // Only check if visualization exists
          if (!visualization) continue;

          // Check if visualization has at least dashboardUrl or visualizationType
          if (!visualization.dashboardUrl && !visualization.visualizationType) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteVisualization',
              data: { name: name || 'Unnamed metric' },
            });
          }

          // Check alerting completeness if alerting exists
          if (visualization.alerting) {
            const alerting = visualization.alerting;
            if (
              alerting.enabled === undefined ||
              !alerting.channels ||
              alerting.channels.length === 0 ||
              !alerting.conditions ||
              alerting.conditions.length === 0
            ) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteAlerting',
                data: { name: name || 'Unnamed metric' },
              });
            }
          }
        }
      },
    };
  },
});

