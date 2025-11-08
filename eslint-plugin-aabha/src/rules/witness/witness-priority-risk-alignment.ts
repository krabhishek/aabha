/**
 * Witness Priority Risk Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **priority and risk alignment** ensures that high-priority
 * witnesses have corresponding risk levels. Critical witnesses should have high risk levels,
 * and low-priority witnesses should have low risk levels. Misaligned priority and risk create
 * confusion about test importance and prevent AI from correctly prioritizing test execution.
 *
 * Priority-risk alignment enables AI to:
 * 1. **Prioritize test execution** - Run critical tests first
 * 2. **Understand test importance** - Know which tests are most critical
 * 3. **Generate test reports** - Highlight high-priority, high-risk tests
 * 4. **Allocate resources** - Focus testing effort on critical areas
 *
 * Misaligned priority and risk mean AI can't correctly prioritize test execution or understand test importance.
 *
 * **What it checks:**
 * - Witnesses with `execution.priority: 'critical'` should have `coverage.riskLevel: 'high'`
 * - Witnesses with `execution.priority: 'low'` should have `coverage.riskLevel: 'low'`
 * - Priority and risk levels are aligned
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Priority and risk aligned
 * @Witness({
 *   name: 'Payment Processing Test',
 *   execution: {
 *     priority: WitnessPriority.Critical
 *   },
 *   coverage: {
 *     riskLevel: WitnessRiskLevel.High  // ✓ Aligned
 *   }
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Priority and risk misaligned
 * @Witness({
 *   name: 'Payment Processing Test',
 *   execution: {
 *     priority: WitnessPriority.Critical
 *   },
 *   coverage: {
 *     riskLevel: WitnessRiskLevel.Low  // ✗ Misaligned
 *   }
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalPriorityLowRisk' | 'lowPriorityHighRisk';

export const witnessPriorityRiskAlignment = createRule<[], MessageIds>({
  name: 'witness-priority-risk-alignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness priority and risk level should be aligned - critical priority should have high risk, low priority should have low risk',
    },
    messages: {
      criticalPriorityLowRisk: "Witness '{{name}}' has critical priority but low risk level. Critical witnesses should have high risk levels to reflect their importance. Update coverage.riskLevel to WitnessRiskLevel.High to align with the critical priority, or reduce the priority if the risk is actually low.",
      lowPriorityHighRisk: "Witness '{{name}}' has low priority but high risk level. Low-priority witnesses should have low risk levels. Update coverage.riskLevel to WitnessRiskLevel.Low to align with the low priority, or increase the priority if the risk is actually high.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        // Check if this method has decorators
        if (!node.decorators || node.decorators.length === 0) return;

        // Find @Witness decorator
        for (const decorator of node.decorators) {
          const parsed = parseAabhaDecorator(decorator);
          if (!parsed || parsed.type !== 'Witness') continue;

          const name = parsed.metadata.name as string | undefined;
          const execution = parsed.metadata.execution as Record<string, unknown> | undefined;
          const coverage = parsed.metadata.coverage as Record<string, unknown> | undefined;

          if (!execution || !coverage) continue;

          const priority = execution.priority as string | undefined;
          const riskLevel = coverage.riskLevel as string | undefined;

          if (!priority || !riskLevel) continue;

          const priorityLower = priority.toLowerCase();
          const riskLower = riskLevel.toLowerCase();

          const isCritical = priorityLower.includes('critical') || priorityLower === 'critical';
          const isLowPriority = priorityLower.includes('low') || priorityLower === 'low';
          const isHighRisk = riskLower.includes('high') || riskLower === 'high';
          const isLowRisk = riskLower.includes('low') || riskLower === 'low';

          if (isCritical && isLowRisk) {
            context.report({
              node: decorator,
              messageId: 'criticalPriorityLowRisk',
              data: { name: name || 'Unnamed witness' },
            });
          } else if (isLowPriority && isHighRisk) {
            context.report({
              node: decorator,
              messageId: 'lowPriorityHighRisk',
              data: { name: name || 'Unnamed witness' },
            });
          }
        }
      },
    };
  },
});
