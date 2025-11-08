/**
 * Action Journey Scope Event Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **Journey scope** actions represent major business milestones
 * within a journey. Journey scope actions SHOULD emit business events to signal significant state changes
 * and enable event-driven architecture. Without events, journey milestones cannot trigger downstream
 * journeys or be tracked in business reporting.
 *
 * Journey scope events enable AI to:
 * 1. **Enable event-driven architecture** - Trigger downstream journeys and processes
 * 2. **Support business reporting** - Track milestone completion in analytics
 * 3. **Enable audit trails** - Record significant business state changes
 * 4. **Support integration** - Allow other systems to react to milestone completion
 *
 * **What it checks:**
 * - Journey scope actions SHOULD have `emitsEvent` field (recommended, not required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Journey scope with event
 * @Action({
 *   name: 'Email Verified',
 *   scope: ActionScope.Journey,
 *   emitsEvent: 'account.email.verified'
 * })
 *
 * // ⚠️ Warning - Journey scope without event (recommended)
 * @Action({
 *   name: 'Email Verified',
 *   scope: ActionScope.Journey
 *   // Missing emitsEvent - Journey scope actions SHOULD emit events
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingJourneyEvent';

export const actionJourneyScopeEventRecommended = createRule<[], MessageIds>({
  name: 'action-journey-scope-event-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journey scope actions should emit business events. Journey scope actions represent major business milestones and should emit events to enable event-driven architecture and business reporting.',
    },
    messages: {
      missingJourneyEvent:
        "Action '{{name}}' has scope 'Journey' but doesn't emit a business event. Journey scope actions represent major business milestones and SHOULD emit events to signal significant state changes. Events enable event-driven architecture, downstream journey triggering, business reporting, and audit trails. Add an emitsEvent field (e.g., 'emitsEvent: \"account.email.verified\"' following the domain.entity.action format).",
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
          if (decorator.type !== 'Action') continue;

          const name = decorator.metadata.name as string | undefined;
          const scope = decorator.metadata.scope as string | undefined;
          const emitsEvent = decorator.metadata.emitsEvent as string | undefined;

          // Only check Journey scope actions
          if (scope !== 'Journey') continue;

          // Check if emitsEvent is missing (recommended, not required)
          if (!emitsEvent) {
            context.report({
              node: decorator.node,
              messageId: 'missingJourneyEvent',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if emitsEvent already exists in source to avoid duplicates
                if (source.includes('emitsEvent:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const eventTemplate = needsComma
                  ? `,\n  emitsEvent: '',  // TODO: Business event in domain.entity.action format (e.g., 'account.email.verified')`
                  : `\n  emitsEvent: '',  // TODO: Business event in domain.entity.action format (e.g., 'account.email.verified')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  eventTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

