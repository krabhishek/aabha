/**
 * Context Capability Structure Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **capabilities** describe what a context can do.
 * Organizing capabilities by maturity level (core, supporting, emerging) creates strategic
 * clarity that helps AI systems understand organizational priorities and evolution paths.
 *
 * Proper capability structuring enables:
 * 1. **Strategic AI decision-making** - AI can prioritize core capabilities when generating
 *    architecture recommendations and identify where to invest engineering effort
 * 2. **Evolution tracking** - AI can monitor how capabilities mature from emerging to core,
 *    helping predict technical debt and refactoring needs
 * 3. **Resource allocation guidance** - Core capabilities signal where to focus quality,
 *    performance, and reliability investments
 * 4. **Integration planning** - AI can distinguish between strategic differentiators (core)
 *    and commodity capabilities (supporting) when suggesting build vs. buy decisions
 *
 * **What it checks:**
 * - Context has a `capabilities` object defined
 * - Capabilities object has at least one `core` capability (required)
 * - Core capabilities array is non-empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Well-structured capabilities
 * @Context({
 *   name: 'Payment Processing',
 *   capabilities: {
 *     core: [
 *       'Real-time payment authorization',
 *       'Multi-currency settlement',
 *       'Fraud detection'
 *     ],
 *     supporting: [
 *       'Payment method management',
 *       'Transaction history'
 *     ],
 *     emerging: [
 *       'Cryptocurrency support',
 *       'Buy-now-pay-later integration'
 *     ]
 *   }
 * })
 *
 * // ✅ Good - Minimal core capabilities
 * @Context({
 *   name: 'User Authentication',
 *   capabilities: {
 *     core: ['Secure login', 'Multi-factor authentication']
 *   }
 * })
 *
 * // ❌ Bad - No capabilities defined
 * @Context({
 *   name: 'Risk Management'
 *   // Missing capabilities object
 * })
 *
 * // ❌ Bad - Capabilities object but no core capabilities
 * @Context({
 *   name: 'Reporting',
 *   capabilities: {
 *     supporting: ['Generate reports']
 *     // Missing core capabilities
 *   }
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCapabilities' | 'missingCoreCapabilities';

export const contextCapabilityStructure = createRule<[], MessageIds>({
  name: 'context-capability-structure',
  meta: {
    type: 'problem',
    docs: {
      description: 'Contexts should have capabilities organized by maturity (core, supporting, emerging) to clarify strategic focus. Well-structured capabilities help AI understand organizational priorities and make better architectural decisions.',
    },
    messages: {
      missingCapabilities: "Context '{{name}}' has no capabilities defined. In context engineering, capabilities describe what the context can do and signal strategic priorities to AI systems. Add a 'capabilities' object with at least 'core' capabilities (strategic differentiators) to help AI understand this context's value proposition. Consider also defining 'supporting' (necessary but not differentiating) and 'emerging' (in development) capabilities.",
      missingCoreCapabilities: "Context '{{name}}' has a capabilities object but no 'core' capabilities defined. Core capabilities are the strategic differentiators - what this context does best. AI uses core capabilities to understand where to focus quality investments and architectural rigor. Define at least one core capability that represents this context's primary value.",
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
          // Only apply to Context decorators
          if (decorator.type !== 'Context') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const capabilities = decorator.metadata.capabilities as { core?: unknown[] } | undefined;

          // Check if capabilities are defined
          if (!capabilities) {
            context.report({
              node: decorator.node,
              messageId: 'missingCapabilities',
              data: {
                name: name || 'Unknown',
              },
            });
            continue;
          }

          // Check if core capabilities are defined (required)
          if (!capabilities.core || !Array.isArray(capabilities.core) || capabilities.core.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingCoreCapabilities',
              data: {
                name: name || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
