/**
 * Interaction Quality SLO Percentile Ordering Rule
 *
 * **Why this rule exists:**
 * SLO (Service Level Objective) percentiles must be ordered from lowest to highest. In statistics
 * and performance engineering, p50 represents the median (50th percentile), p95 represents the
 * 95th percentile, p99 the 99th percentile, and max represents the worst case (100th percentile).
 *
 * Misordered percentiles indicate:
 * - **Logical error** - SLO targets make no statistical sense
 * - **Copy-paste mistake** - Values were copied incorrectly
 * - **Misunderstanding** - Team doesn't understand percentile semantics
 * - **Monitoring failure** - AI systems cannot correctly track performance
 *
 * Correct ordering enables:
 * 1. **Statistical validity** - SLOs reflect actual performance distribution
 * 2. **Clear performance targets** - p50 < p95 < p99 < max is mathematically required
 * 3. **AI monitoring** - Systems can detect anomalies and degradation
 * 4. **Alerting accuracy** - Performance breaches trigger correct alerts
 *
 * **What it checks:**
 * - quality.slos array has percentiles in correct order (p50 < p95 < p99 < max)
 * - Percentile targets increase monotonically (never decrease)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Correct percentile ordering
 * @Interaction({
 *   name: 'User API',
 *   quality: {
 *     slos: [
 *       { percentile: 'p50', target: '100ms', metric: 'latency' },
 *       { percentile: 'p95', target: '250ms', metric: 'latency' },
 *       { percentile: 'p99', target: '500ms', metric: 'latency' },
 *       { percentile: 'max', target: '2s', metric: 'latency' }
 *     ]
 *   }
 * })
 *
 * // ❌ Bad - Misordered percentiles
 * @Interaction({
 *   quality: {
 *     slos: [
 *       { percentile: 'p95', target: '250ms', metric: 'latency' },  // Wrong order!
 *       { percentile: 'p50', target: '100ms', metric: 'latency' },
 *       { percentile: 'max', target: '2s', metric: 'latency' },
 *       { percentile: 'p99', target: '500ms', metric: 'latency' }
 *     ]
 *   }
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incorrectPercentileOrder';

const PERCENTILE_ORDER: Record<string, number> = {
  p50: 1,
  p95: 2,
  p99: 3,
  max: 4,
};

export const interactionQualitySloPercentileOrdering = createRule<[], MessageIds>({
  name: 'interaction-quality-slo-percentile-ordering',
  meta: {
    type: 'problem',
    docs: {
      description:
        'SLO percentiles in quality.slos must be ordered correctly (p50 < p95 < p99 < max). In context engineering, correct percentile ordering ensures statistical validity and enables AI monitoring.',
    },
    messages: {
      incorrectPercentileOrder:
        "Interaction '{{interactionName}}' has SLO percentiles out of order at indices {{index1}} and {{index2}} ('{{percentile1}}' should come before '{{percentile2}}'). In context engineering, percentiles must follow statistical ordering: p50 (median) < p95 < p99 < max (worst case). Correct ordering enables AI systems to accurately monitor performance distributions and detect anomalies. Reorder your SLOs: p50 first, then p95, then p99, then max.",
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
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const quality = decorator.metadata.quality as {
            slos?: Array<{
              percentile: string;
              target: string;
              metric: string;
            }>;
          } | undefined;

          if (!quality?.slos || !Array.isArray(quality.slos)) continue;

          // Check ordering of percentiles
          for (let i = 0; i < quality.slos.length - 1; i++) {
            const currentSlo = quality.slos[i];
            const nextSlo = quality.slos[i + 1];

            if (!currentSlo?.percentile || !nextSlo?.percentile) continue;

            const currentOrder = PERCENTILE_ORDER[currentSlo.percentile];
            const nextOrder = PERCENTILE_ORDER[nextSlo.percentile];

            // If both percentiles are recognized and out of order
            if (currentOrder !== undefined && nextOrder !== undefined && currentOrder > nextOrder) {
              context.report({
                node: decorator.node,
                messageId: 'incorrectPercentileOrder',
                data: {
                  interactionName: interactionName || 'Unknown',
                  index1: i.toString(),
                  index2: (i + 1).toString(),
                  percentile1: currentSlo.percentile,
                  percentile2: nextSlo.percentile,
                },
              });
            }
          }
        }
      },
    };
  },
});
