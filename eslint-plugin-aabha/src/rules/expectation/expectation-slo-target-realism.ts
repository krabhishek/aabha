/**
 * Expectation SLO Target Realism Rule
 *
 * **Why this rule exists:**
 * In context engineering, Service Level Objectives (SLOs) define **measurable, realistic targets**
 * that AI systems and teams use to verify expectations are being met in production. Unrealistic
 * or mathematically impossible SLO targets break the feedback loop between expectations and
 * reality, preventing AI from learning system capabilities and making accurate predictions.
 *
 * Unrealistic SLO targets cause:
 * - **Impossible goals** - Availability > 100% or negative latency is physically impossible
 * - **Mathematical inconsistency** - p50 > p95 violates percentile definitions
 * - **AI training corruption** - AI learns incorrect patterns from invalid data
 * - **Monitoring failure** - Alert systems cannot validate against nonsensical thresholds
 *
 * Realistic SLO targets enable:
 * 1. **Valid measurements** - Targets respect physical and mathematical constraints
 * 2. **AI learning** - AI can accurately predict system behavior from historical SLO data
 * 3. **Reliable alerting** - Monitoring systems can detect real SLO breaches
 * 4. **Capacity planning** - Teams can reason about performance tradeoffs
 *
 * **What it checks:**
 * - Availability: 0% < target ≤ 100%
 * - Latency percentiles: p50 < p95 < p99 < max (ascending order)
 * - All latency values are positive, realistic durations
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Realistic, properly ordered SLO targets
 * @Expectation({
 *   name: 'Fast Account Opening',
 *   quality: {
 *     slo: {
 *       availability: { target: '99.9%', errorBudget: '43m/month' },
 *       latency: { p50: '100ms', p95: '500ms', p99: '1s', max: '5s' }
 *     }
 *   }
 * })
 *
 * // ❌ Bad - Availability exceeds 100% (impossible)
 * @Expectation({
 *   name: 'Perfect System',
 *   quality: {
 *     slo: {
 *       availability: { target: '150%' } // Physically impossible!
 *     }
 *   }
 * })
 *
 * // ❌ Bad - Latency percentiles not ordered (violates statistics)
 * @Expectation({
 *   name: 'Fast Processing',
 *   quality: {
 *     slo: {
 *       latency: { p50: '500ms', p95: '200ms', p99: '1s' }
 *       // p95 < p50 violates percentile definition!
 *     }
 *   }
 * })
 * // Mathematical fact: 95th percentile cannot be lower than median (50th)
 *
 * // ❌ Bad - Zero or negative availability
 * @Expectation({
 *   name: 'Unreliable Service',
 *   quality: {
 *     slo: {
 *       availability: { target: '0%' } // Meaningless target
 *     }
 *   }
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'availabilityExceeds100' | 'availabilityZeroOrNegative' | 'latencyPercentileOrdering';

/**
 * Parse latency value to milliseconds
 */
function parseLatency(val: string | undefined): number | undefined {
  if (!val) return undefined;
  const match = val.match(/^(\d+(?:\.\d+)?)(ms|s|m)?$/);
  if (!match) return undefined;
  const num = parseFloat(match[1]);
  const unit = match[2] || 'ms';
  // Convert to milliseconds
  if (unit === 's') return num * 1000;
  if (unit === 'm') return num * 60000;
  return num;
}

export const expectationSloTargetRealism = createRule<[], MessageIds>({
  name: 'expectation-slo-target-realism',
  meta: {
    type: 'problem',
    docs: {
      description: 'SLO targets must be realistic and mathematically valid. In context engineering, unrealistic SLO targets (availability > 100%, misordered latency percentiles) break the feedback loop between expectations and reality, preventing AI systems from learning accurate system behavior patterns.',
    },
    messages: {
      availabilityExceeds100: "Expectation '{{expectationName}}' has SLO availability target of {{target}}, which exceeds 100%. In context engineering, availability represents the percentage of time a system is operational - it cannot physically exceed 100%. This creates an impossible goal that breaks monitoring systems and prevents AI from learning realistic system capabilities. SLO targets must be achievable and measurable. Set a realistic availability target (e.g., 99.9%, 99.99%) based on your actual system reliability requirements and constraints.",
      availabilityZeroOrNegative: "Expectation '{{expectationName}}' has SLO availability target of {{target}}, which is ≤ 0%. In context engineering, zero or negative availability is meaningless - it suggests the system should never work. SLO targets must represent realistic, achievable goals that teams and AI systems can measure and optimize toward. If you truly expect zero availability, remove the SLO entirely. Otherwise, set a positive availability target that reflects your actual reliability requirements (e.g., 95%, 99%, 99.9%).",
      latencyPercentileOrdering: "Expectation '{{expectationName}}' has SLO latency percentiles that violate mathematical ordering: {{comparison}}. In statistics, percentiles must be in ascending order - p50 (median) < p95 < p99 < max. When {{lowerPercentile}} ({{lowerValue}}) ≥ {{higherPercentile}} ({{higherValue}}), it creates a mathematical impossibility that breaks monitoring, alerting, and AI prediction systems. This prevents AI from learning accurate performance patterns and makes it impossible to validate SLO compliance. Correct the latency values to respect percentile ordering - higher percentiles represent worse performance and must have higher latency values.",
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
          if (decorator.type !== 'Expectation') continue;

          const expectationName = decorator.metadata.name as string | undefined;
          const quality = decorator.metadata.quality as any | undefined;

          if (!quality?.slo) continue;

          const slo = quality.slo;

          // Validate availability target
          if (slo.availability?.target) {
            const target = slo.availability.target;
            const match = target.match(/^(\d+(?:\.\d+)?)%?$/);

            if (match) {
              const value = parseFloat(match[1]);

              if (value > 100) {
                context.report({
                  node: decorator.node,
                  messageId: 'availabilityExceeds100',
                  data: {
                    expectationName: expectationName || 'Unknown',
                    target,
                  },
                });
              } else if (value <= 0) {
                context.report({
                  node: decorator.node,
                  messageId: 'availabilityZeroOrNegative',
                  data: {
                    expectationName: expectationName || 'Unknown',
                    target,
                  },
                });
              }
            }
          }

          // Validate latency percentile ordering
          if (slo.latency) {
            const { p50, p95, p99, max } = slo.latency;

            const p50Ms = parseLatency(p50);
            const p95Ms = parseLatency(p95);
            const p99Ms = parseLatency(p99);
            const maxMs = parseLatency(max);

            // Check p50 < p95
            if (p50Ms !== undefined && p95Ms !== undefined && p50Ms >= p95Ms) {
              context.report({
                node: decorator.node,
                messageId: 'latencyPercentileOrdering',
                data: {
                  expectationName: expectationName || 'Unknown',
                  comparison: `p50 (${p50}) ≥ p95 (${p95})`,
                  lowerPercentile: 'p50',
                  lowerValue: p50,
                  higherPercentile: 'p95',
                  higherValue: p95,
                },
              });
            }

            // Check p95 < p99
            if (p95Ms !== undefined && p99Ms !== undefined && p95Ms >= p99Ms) {
              context.report({
                node: decorator.node,
                messageId: 'latencyPercentileOrdering',
                data: {
                  expectationName: expectationName || 'Unknown',
                  comparison: `p95 (${p95}) ≥ p99 (${p99})`,
                  lowerPercentile: 'p95',
                  lowerValue: p95,
                  higherPercentile: 'p99',
                  higherValue: p99,
                },
              });
            }

            // Check p99 < max
            if (p99Ms !== undefined && maxMs !== undefined && p99Ms >= maxMs) {
              context.report({
                node: decorator.node,
                messageId: 'latencyPercentileOrdering',
                data: {
                  expectationName: expectationName || 'Unknown',
                  comparison: `p99 (${p99}) ≥ max (${max})`,
                  lowerPercentile: 'p99',
                  lowerValue: p99,
                  higherPercentile: 'max',
                  higherValue: max,
                },
              });
            }
          }
        }
      },
    };
  },
});
