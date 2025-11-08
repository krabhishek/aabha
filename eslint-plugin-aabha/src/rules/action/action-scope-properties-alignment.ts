/**
 * Action Scope Properties Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, action **scope** defines the granularity and
 * architectural significance of an action. The scope isn't just a label - it signals to AI
 * systems and developers the role this action plays in your business architecture:
 *
 * - **System scope** = Cross-system integration, MUST emit events, MUST be automated
 * - **Journey scope** = Business-significant milestone, SHOULD emit events
 * - **Composite scope** = Orchestration of smaller actions, typically no events
 * - **Atomic scope** = Smallest unit of work, needs duration estimates, rarely emits events
 *
 * When scope and properties misalign (e.g., System scope without automation, or Atomic scope
 * emitting business events), you're creating conflicting context that confuses AI assistants.
 * AI systems use scope to infer architectural patterns, generate appropriate handlers, and
 * understand system boundaries.
 *
 * **What it checks:**
 * - System scope actions MUST be fully-automated and emit events
 * - Journey scope actions SHOULD emit business events
 * - Atomic scope actions SHOULD specify estimatedDuration
 * - Atomic/Composite scope actions typically shouldn't emit domain events
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - System scope with event and automation
 * @Action({
 *   name: 'Sync Customer Data',
 *   scope: ActionScope.System,
 *   automationLevel: 'fully-automated',
 *   emitsEvent: 'customer.data.synced'
 * })
 *
 * // ✅ Good - Atomic scope with duration
 * @Action({
 *   name: 'Fill Form Field',
 *   scope: ActionScope.Atomic,
 *   estimatedDuration: '5s'
 * })
 *
 * // ❌ Bad - System scope without automation
 * @Action({
 *   scope: ActionScope.System,
 *   automationLevel: 'manual'  // System MUST be automated!
 * })
 *
 * // ⚠️ Warning - Atomic emitting business event
 * @Action({
 *   scope: ActionScope.Atomic,
 *   emitsEvent: 'order.created'  // Should this be Journey scope?
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'scopeMissingEvent'
  | 'systemScopeNotAutomated'
  | 'atomicMissingDuration'
  | 'atomicEmitsEvent';

export const actionScopePropertiesAlignment = createRule<[], MessageIds>({
  name: 'action-scope-properties-alignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Action properties should align with their declared scope to create consistent, AI-comprehensible architectural context',
    },
    messages: {
      scopeMissingEvent:
        "Action '{{name}}' has scope '{{scope}}' but doesn't emit a business event. {{severity}} scope actions {{requirement}} have 'emitsEvent' to signal business-significant state changes. Without events, AI systems can't understand the architectural impact of this action or generate appropriate event handlers. Domain events are how distributed systems communicate - missing events break the context chain.",
      systemScopeNotAutomated:
        "Action '{{name}}' has scope 'System' but automationLevel is '{{automationLevel}}'. System scope actions represent cross-system integrations that MUST be fully-automated - they run without human intervention. Manual system actions create conflicting context: 'System' signals automated integration, but 'manual' requires human actors. This confuses AI assistants trying to generate implementation code. Either change scope or set automationLevel: StepAutomationLevel.FullyAutomated.",
      atomicMissingDuration:
        "Action '{{name}}' has scope 'Atomic' but doesn't specify estimatedDuration. Atomic actions are the smallest units of work - knowing their duration helps AI understand workflow timing, UX expectations, and timeout configurations. Duration context enables AI to generate realistic journey flows and identify performance bottlenecks. Consider adding estimatedDuration for better planning.",
      atomicEmitsEvent:
        "Action '{{name}}' has scope '{{scope}}' but emits business event '{{emitsEvent}}'. {{scope}} scope actions typically don't emit domain events - they're implementation details, not business milestones. Emitting events suggests this action has business significance. Consider if this should be Journey or System scope instead, so AI can properly understand its architectural role and generate appropriate event subscribers.",
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
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const scope = decorator.metadata.scope as string | undefined;
          const emitsEvent = decorator.metadata.emitsEvent as string | undefined;
          const automationLevel = decorator.metadata.automationLevel as string | undefined;
          const estimatedDuration = decorator.metadata.estimatedDuration as string | undefined;

          if (!scope) continue;

          // Normalize scope to handle both enum values and enum references
          const isJourney = scope === 'Journey' || scope === 'journey' || 
                          scope === 'ActionScope.Journey' ||
                          (typeof scope === 'string' && scope.includes('Journey'));
          const isSystem = scope === 'System' || scope === 'system' || 
                          scope === 'ActionScope.System' ||
                          (typeof scope === 'string' && scope.includes('System'));
          const isAtomic = scope === 'Atomic' || scope === 'atomic' || 
                          scope === 'ActionScope.Atomic' ||
                          (typeof scope === 'string' && scope.includes('Atomic'));
          const isComposite = scope === 'Composite' || scope === 'composite' || 
                            scope === 'ActionScope.Composite' ||
                            (typeof scope === 'string' && scope.includes('Composite'));

          // Check for both the enum value 'fully-automated' and the enum reference 'StepAutomationLevel.FullyAutomated'
          const isFullyAutomated = automationLevel === 'fully-automated' || 
                                  automationLevel === 'StepAutomationLevel.FullyAutomated' ||
                                  (typeof automationLevel === 'string' && automationLevel.includes('FullyAutomated'));

          // Journey/System scope should emit events
          if ((isJourney || isSystem) && !emitsEvent) {
            context.report({
              node: decorator.node,
              messageId: 'scopeMissingEvent',
              data: {
                name: name || 'Unknown',
                scope,
                severity: isSystem ? 'System' : 'Journey',
                requirement: isSystem ? 'MUST' : 'SHOULD',
              },
            });
          }

          // System scope MUST be fully automated
          if (isSystem && !isFullyAutomated) {
            context.report({
              node: decorator.node,
              messageId: 'systemScopeNotAutomated',
              data: {
                name: name || 'Unknown',
                automationLevel: automationLevel || 'not set',
              },
            });
          }

          // Atomic scope should have estimatedDuration
          if (isAtomic && !estimatedDuration) {
            context.report({
              node: decorator.node,
              messageId: 'atomicMissingDuration',
              data: {
                name: name || 'Unknown',
              },
            });
          }

          // Atomic/Composite with emitsEvent should be reconsidered
          if ((isAtomic || isComposite) && emitsEvent) {
            context.report({
              node: decorator.node,
              messageId: 'atomicEmitsEvent',
              data: {
                name: name || 'Unknown',
                scope,
                emitsEvent,
              },
            });
          }
        }
      },
    };
  },
});
