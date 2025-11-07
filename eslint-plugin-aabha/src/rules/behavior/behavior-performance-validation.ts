/**
 * Behavior Performance Validation Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **performance characteristics** of behaviors help AI
 * systems understand non-functional requirements and generate optimized implementations. When
 * performance expectations (latency, throughput, resource usage) are missing or unrealistic, AI
 * can't generate appropriate implementations or suggest proper optimizations.
 *
 * Well-defined performance context enables AI to:
 * 1. **Generate optimized code** - Performance targets guide algorithm and data structure choices
 * 2. **Suggest caching strategies** - Latency requirements inform when caching is appropriate
 * 3. **Design scalable architectures** - Throughput requirements help AI understand scale needs
 * 4. **Allocate resources** - Performance context informs infrastructure decisions
 *
 * Missing or unrealistic performance expectations mean AI systems generate generic code without
 * performance awareness, leading to implementations that don't meet business requirements.
 *
 * **What it checks:**
 * - Performance-critical behaviors have performance expectations defined
 * - Performance expectations are realistic (latency, throughput values make sense)
 * - Performance metrics align with behavior complexity
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Performance expectations defined
 * @Behavior({
 *   name: 'Validate Email Format',
 *   performance: {
 *     maxLatency: '10ms',
 *     throughput: '10000 req/s'
 *   }
 * })
 *
 * // ✅ Good - Realistic performance for complex behavior
 * @Behavior({
 *   name: 'Process Multi-Step Payment',
 *   complexity: 'complex',
 *   performance: {
 *     maxLatency: '2s',
 *     throughput: '100 req/s'
 *   }
 * })
 *
 * // ❌ Bad - Missing performance expectations
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // How fast should this be? AI can't optimize without targets
 * })
 *
 * // ❌ Bad - Unrealistic performance
 * @Behavior({
 *   name: 'Process Multi-Step Payment',
 *   performance: {
 *     maxLatency: '1ms',  // Unrealistic for complex multi-step process
 *     throughput: '1000000 req/s'  // Unrealistic throughput
 *   }
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPerformance' | 'unrealisticLatency' | 'unrealisticThroughput';

export const behaviorPerformanceValidation = createRule<[], MessageIds>({
  name: 'behavior-performance-validation',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure behaviors have realistic performance expectations to help AI generate optimized, performance-aware implementations',
    },
    messages: {
      missingPerformance: "Behavior '{{name}}' is missing performance expectations. In context engineering, performance characteristics (latency, throughput) help AI systems understand non-functional requirements and generate optimized implementations. Without performance context, AI generates generic code that may not meet business requirements. Add performance expectations (maxLatency, throughput) to guide implementation optimization.",
      unrealisticLatency: "Behavior '{{name}}' has unrealistic latency expectation '{{latency}}'. Performance expectations should be achievable given the behavior's complexity ({{complexity}}). Unrealistic expectations create contradictory context - AI may generate over-optimized code that fails to meet the target, or may ignore the target entirely. Adjust latency to a realistic value based on the behavior's complexity and dependencies.",
      unrealisticThroughput: "Behavior '{{name}}' has unrealistic throughput expectation '{{throughput}}'. Performance expectations should be achievable given the behavior's complexity ({{complexity}}) and dependencies. Unrealistic expectations create contradictory context that confuses AI systems trying to generate optimized implementations. Adjust throughput to a realistic value based on the behavior's characteristics.",
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
          // Only apply to Behavior decorators
          if (decorator.type !== 'Behavior') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const performance = decorator.metadata.performance as Record<string, unknown> | undefined;
          const complexity = decorator.metadata.complexity as string | undefined;

          // Check if performance is missing
          if (!performance) {
            context.report({
              node: decorator.node,
              messageId: 'missingPerformance',
              data: {
                name: name || 'Unknown',
              },
            });
            continue;
          }

          const maxLatency = performance.maxLatency as string | undefined;
          const throughput = performance.throughput as string | undefined;

          // Check for unrealistic latency (simple heuristic: parse numeric value)
          if (maxLatency) {
            const latencyMatch = maxLatency.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h)?$/i);
            if (latencyMatch) {
              const value = parseFloat(latencyMatch[1]);
              const unit = (latencyMatch[2] || 'ms').toLowerCase();
              let latencyMs = value;

              if (unit === 's') latencyMs = value * 1000;
              else if (unit === 'm') latencyMs = value * 60000;
              else if (unit === 'h') latencyMs = value * 3600000;

              // Unrealistic if < 1ms for complex behaviors or > 10s for simple behaviors
              if (complexity === 'complex' && latencyMs < 1) {
                context.report({
                  node: decorator.node,
                  messageId: 'unrealisticLatency',
                  data: {
                    name: name || 'Unknown',
                    latency: maxLatency,
                    complexity: complexity || 'unknown',
                  },
                });
              } else if (complexity === 'simple' && latencyMs > 10000) {
                context.report({
                  node: decorator.node,
                  messageId: 'unrealisticLatency',
                  data: {
                    name: name || 'Unknown',
                    latency: maxLatency,
                    complexity: complexity || 'unknown',
                  },
                });
              }
            }
          }

          // Check for unrealistic throughput (simple heuristic)
          if (throughput) {
            const throughputMatch = throughput.match(/^(\d+(?:\.\d+)?)\s*(req|reqs|ops)?\s*\/\s*(s|sec|second)?$/i);
            if (throughputMatch) {
              const value = parseFloat(throughputMatch[1]);

              // Unrealistic if > 1M req/s for complex behaviors
              if (complexity === 'complex' && value > 1000000) {
                context.report({
                  node: decorator.node,
                  messageId: 'unrealisticThroughput',
                  data: {
                    name: name || 'Unknown',
                    throughput,
                    complexity: complexity || 'unknown',
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});
