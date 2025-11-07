/**
 * Stakeholder Metrics Tracking Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, **metrics tracking** enables measurement of stakeholder
 * performance and satisfaction. Stakeholders without metrics or KPIs can't be measured or
 * tracked, making it impossible to understand stakeholder health or generate performance reports.
 *
 * Metrics tracking enables AI to:
 * 1. **Measure stakeholder performance** - Track how well stakeholders are performing
 * 2. **Generate performance reports** - Create stakeholder health dashboards
 * 3. **Identify issues** - Detect when stakeholder metrics are declining
 * 4. **Track satisfaction** - Monitor stakeholder satisfaction indicators
 *
 * Missing metrics means AI can't measure stakeholder performance or generate meaningful reports.
 *
 * **What it checks:**
 * - Stakeholders have `metrics` array OR `kpis` array
 * - At least one metric or KPI is defined
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Metrics or KPIs specified
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   metrics: [PortfolioReturnsMetric, CustomerSatisfactionMetric],
 *   kpis: ['Portfolio return > 8% annually']
 * })
 * export class PrimaryInvestorStakeholder {}
 *
 * // ❌ Bad - Missing metrics
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing metrics and kpis - how will we measure performance?
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMetricsAndKpis';

export const stakeholderMetricsTracking = createRule<[], MessageIds>({
  name: 'stakeholder-metrics-tracking',
  meta: {
    type: 'problem',
    docs: {
      description: 'Stakeholders should have metrics or KPIs to enable performance measurement and tracking',
    },
    messages: {
      missingMetricsAndKpis: "Stakeholder '{{name}}' is missing both 'metrics' and 'kpis' fields. Metrics and KPIs enable measurement of stakeholder performance and satisfaction. Without them, AI systems can't generate performance reports or track stakeholder health. Add at least one of: a metrics array with @Metric references, or a kpis array with measurable indicators (e.g., 'kpis: [\"Portfolio return > 8% annually\"]').",
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
          // Only apply to Stakeholder decorators
          if (decorator.type !== 'Stakeholder') {
            continue;
          }

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const metrics = decorator.metadata.metrics;
          const kpis = decorator.metadata.kpis;

          // Check if both are missing or empty
          const hasMetrics = metrics && Array.isArray(metrics) && metrics.length > 0;
          const hasKpis = kpis && Array.isArray(kpis) && kpis.length > 0;

          if (!hasMetrics && !hasKpis) {
            context.report({
              node: decorator.node,
              messageId: 'missingMetricsAndKpis',
              data: { name },
            });
          }
        }
      },
    };
  },
});
