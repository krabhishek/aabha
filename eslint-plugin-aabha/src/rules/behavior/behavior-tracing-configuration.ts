/**
 * Behavior Tracing Configuration Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **tracing configuration** enables observability and
 * debugging of behaviors in production. Well-configured tracing helps AI systems understand how to
 * instrument code for monitoring, logging, and distributed tracing. Without proper tracing context,
 * AI can't generate observability code that helps teams debug issues and understand system behavior.
 *
 * Tracing configuration enables AI to:
 * 1. **Generate instrumentation code** - Tracing settings inform what metrics and logs to emit
 * 2. **Design observability** - AI knows what to track for debugging and monitoring
 * 3. **Implement distributed tracing** - Trace IDs and spans help AI understand correlation
 * 4. **Create monitoring dashboards** - Tracing context helps AI suggest relevant metrics
 *
 * Missing or misconfigured tracing means AI systems can't generate proper observability code,
 * making it harder to debug issues and understand system behavior in production.
 *
 * **What it checks:**
 * - Critical behaviors have tracing configuration defined
 * - Tracing configuration is properly structured
 * - Complex behaviors have more detailed tracing requirements
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Tracing configuration for critical behavior
 * @Behavior({
 *   name: 'Process Payment',
 *   criticality: 'critical',
 *   tracing: {
 *     enabled: true,
 *     logLevel: 'info',
 *     includeInputs: true,
 *     includeOutputs: false  // Sensitive data
 *   }
 * })
 *
 * // ✅ Good - Complex behavior with detailed tracing
 * @Behavior({
 *   name: 'Multi-Step Validation',
 *   complexity: 'complex',
 *   tracing: {
 *     enabled: true,
 *     logLevel: 'debug',
 *     includeTimings: true,
 *     includeDependencies: true
 *   }
 * })
 *
 * // ⚠️ Warning - Critical behavior without tracing
 * @Behavior({
 *   name: 'Process Payment',
 *   criticality: 'critical'
 *   // No tracing config - harder to debug in production
 * })
 *
 * // ❌ Bad - Tracing disabled for critical behavior
 * @Behavior({
 *   name: 'Process Payment',
 *   criticality: 'critical',
 *   tracing: {
 *     enabled: false  // Should be enabled for critical behaviors
 *   }
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalMissingTracing' | 'criticalTracingDisabled' | 'complexNeedsDetailedTracing';

export const behaviorTracingConfiguration = createRule<[], MessageIds>({
  name: 'behavior-tracing-configuration',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure behaviors have proper tracing configuration to enable observability and help AI generate instrumentation code',
    },
    messages: {
      criticalMissingTracing: "Behavior '{{name}}' is marked 'critical' but has no tracing configuration. Critical behaviors need observability to debug production issues and understand system behavior. Without tracing context, AI can't generate proper instrumentation code (logs, metrics, distributed tracing). Add tracing configuration to enable AI-assisted observability implementation.",
      criticalTracingDisabled: "Behavior '{{name}}' is marked 'critical' but tracing is disabled. Critical behaviors should have tracing enabled to support production debugging and monitoring. Disabled tracing means lost observability context - AI can't generate proper instrumentation when tracing is off. Enable tracing for critical behaviors to maintain system observability.",
      complexNeedsDetailedTracing: "Behavior '{{name}}' is marked 'complex' but has minimal tracing configuration. Complex behaviors need detailed tracing (timings, dependencies, intermediate states) to debug issues effectively. Minimal tracing configuration limits AI's ability to generate comprehensive observability code. Add detailed tracing settings (includeTimings, includeDependencies) for complex behaviors.",
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
          const criticality = decorator.metadata.criticality as string | undefined;
          const complexity = decorator.metadata.complexity as string | undefined;
          const tracing = decorator.metadata.tracing as Record<string, unknown> | undefined;

          // Check if critical behavior is missing tracing
          if (criticality === 'critical' && !tracing) {
            context.report({
              node: decorator.node,
              messageId: 'criticalMissingTracing',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if critical behavior has tracing disabled
          if (criticality === 'critical' && tracing) {
            const enabled = tracing.enabled as boolean | undefined;
            if (enabled === false) {
              context.report({
                node: decorator.node,
                messageId: 'criticalTracingDisabled',
                data: { name: name || 'Unknown' },
              });
            }
          }

          // Check if complex behavior needs more detailed tracing
          if (complexity === 'complex' && tracing) {
            const enabled = tracing.enabled as boolean | undefined;
            if (enabled !== false) {
              const hasTimings = tracing.includeTimings !== undefined;
              const hasDependencies = tracing.includeDependencies !== undefined;
              if (!hasTimings && !hasDependencies) {
                context.report({
                  node: decorator.node,
                  messageId: 'complexNeedsDetailedTracing',
                  data: { name: name || 'Unknown' },
                });
              }
            }
          }
        }
      },
    };
  },
});
