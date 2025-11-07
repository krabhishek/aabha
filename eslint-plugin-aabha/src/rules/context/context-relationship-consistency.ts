/**
 * Context Relationship Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **relationships** between contexts describe how
 * organizational units collaborate and integrate. Vague relationship definitions are like
 * unclear team handoffs - they create integration problems, duplicate work, and data
 * inconsistencies. AI systems need explicit relationship details to understand integration
 * patterns and recommend architectural improvements.
 *
 * Well-defined relationships enable:
 * 1. **AI comprehension of integration patterns** - AI can understand how contexts communicate,
 *    what data they exchange, and how handoffs work
 * 2. **Automated integration recommendations** - AI can suggest integration patterns, APIs,
 *    and event structures based on relationship types and exchanged items
 * 3. **Data flow analysis** - AI can trace how data flows between contexts and identify
 *    bottlenecks or circular dependencies
 * 4. **Team coordination** - Clear relationship descriptions help AI understand which teams
 *    need to collaborate and what protocols they should follow
 *
 * **What it checks:**
 * - Relationships have descriptions explaining how contexts collaborate
 * - Upstream/downstream relationships define what is exchanged (data/services)
 * - Upstream/downstream relationships ideally include handoff protocols
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Well-defined upstream relationship
 * @Context({
 *   name: 'Order Fulfillment',
 *   relationships: [{
 *     type: 'upstream',
 *     with: 'Inventory Management',
 *     description: 'Receives inventory availability before confirming orders',
 *     exchanged: ['Stock levels', 'Product availability', 'Reservation confirmations'],
 *     handoffProtocol: 'Real-time API calls with fallback to event-based updates'
 *   }]
 * })
 *
 * // ✅ Good - Downstream relationship with clear handoff
 * @Context({
 *   name: 'Payment Processing',
 *   relationships: [{
 *     type: 'downstream',
 *     with: 'Order Management',
 *     description: 'Provides payment confirmation to complete orders',
 *     exchanged: ['Payment status', 'Transaction IDs', 'Refund requests'],
 *     handoffProtocol: 'Event-driven notifications with webhook fallback'
 *   }]
 * })
 *
 * // ❌ Bad - Missing description
 * @Context({
 *   name: 'Risk Management',
 *   relationships: [{
 *     type: 'upstream',
 *     with: 'Fraud Detection'
 *     // Missing description
 *   }]
 * })
 *
 * // ❌ Bad - Upstream/downstream without exchanged items
 * @Context({
 *   name: 'Analytics',
 *   relationships: [{
 *     type: 'downstream',
 *     with: 'Data Warehouse',
 *     description: 'Sends data to warehouse'
 *     // Missing exchanged array
 *   }]
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingRelationshipDescription' | 'missingExchangedItems' | 'missingHandoffProtocol';

export const contextRelationshipConsistency = createRule<[], MessageIds>({
  name: 'context-relationship-consistency',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Context relationships should have clear descriptions and define what is exchanged to ensure integration clarity. Well-defined relationships help AI understand integration patterns and recommend architectural improvements.',
    },
    messages: {
      missingRelationshipDescription: "Context '{{name}}' has relationship {{index}} without a description. In context engineering, relationship descriptions explain how contexts collaborate and integrate. Add a description clarifying the nature of this relationship, what problem it solves, and how the contexts work together. Without descriptions, AI cannot understand integration patterns or recommend architectural improvements.",
      missingExchangedItems: "Context '{{name}}' has {{type}} relationship {{index}} without defining 'exchanged' items. Upstream/downstream relationships involve data or service exchange - specify what is exchanged to help AI understand integration requirements and recommend APIs, events, or data structures. Include data entities, service calls, or event types that cross the context boundary.",
      missingHandoffProtocol: "Context '{{name}}' has {{type}} relationship {{index}} without a 'handoffProtocol'. Consider documenting how work is transferred between contexts (e.g., 'Real-time API calls', 'Event-driven notifications', 'Batch processing'). Handoff protocols help AI understand integration patterns and recommend appropriate technical solutions for context collaboration.",
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
          const relationships = decorator.metadata.relationships as Array<{
            type?: string;
            description?: string;
            exchanged?: unknown[];
            handoffProtocol?: string;
          }> | undefined;

          if (!relationships || !Array.isArray(relationships) || relationships.length === 0) {
            // No relationships is acceptable - not all contexts have explicit relationships
            continue;
          }

          // Check each relationship for completeness
          relationships.forEach((rel, index) => {
            // Check for description
            if (!rel.description?.trim()) {
              context.report({
                node: decorator.node,
                messageId: 'missingRelationshipDescription',
                data: {
                  name: name || 'Unknown',
                  index: (index + 1).toString(),
                },
              });
            }

            // Check for exchanged items (especially important for upstream/downstream)
            if (
              (rel.type === 'upstream' || rel.type === 'downstream') &&
              (!rel.exchanged || !Array.isArray(rel.exchanged) || rel.exchanged.length === 0)
            ) {
              context.report({
                node: decorator.node,
                messageId: 'missingExchangedItems',
                data: {
                  name: name || 'Unknown',
                  type: rel.type,
                  index: (index + 1).toString(),
                },
              });
            }

            // Check for handoff protocol (recommended for upstream/downstream)
            if (
              (rel.type === 'upstream' || rel.type === 'downstream') &&
              !rel.handoffProtocol?.trim()
            ) {
              context.report({
                node: decorator.node,
                messageId: 'missingHandoffProtocol',
                data: {
                  name: name || 'Unknown',
                  type: rel.type,
                  index: (index + 1).toString(),
                },
              });
            }
          });
        }
      },
    };
  },
});
