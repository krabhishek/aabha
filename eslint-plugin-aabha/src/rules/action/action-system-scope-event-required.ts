/**
 * Action System Scope Event Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **System scope** actions represent cross-journey, system-wide
 * strategic milestones. System scope actions MUST emit business events to signal significant state changes
 * and enable event-driven architecture. Without events, system milestones cannot trigger downstream
 * processes or be tracked in business reporting.
 *
 * System scope events enable AI to:
 * 1. **Enable event-driven architecture** - Trigger downstream processes and integrations
 * 2. **Support business reporting** - Track strategic milestone completion in analytics
 * 3. **Enable audit trails** - Record significant system-wide state changes
 * 4. **Support integration** - Allow other systems to react to strategic milestones
 *
 * **What it checks:**
 * - System scope actions MUST have `emitsEvent` field (required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - System scope with event
 * @Action({
 *   name: 'Customer Fully Onboarded',
 *   scope: ActionScope.System,
 *   emitsEvent: 'customer.fully.onboarded'
 * })
 *
 * // ❌ Bad - System scope without event (required)
 * @Action({
 *   name: 'Customer Fully Onboarded',
 *   scope: ActionScope.System
 *   // Missing emitsEvent - System scope actions MUST emit events
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingSystemEvent';

export const actionSystemScopeEventRequired = createRule<[], MessageIds>({
  name: 'action-system-scope-event-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'System scope actions must emit business events. System scope actions represent cross-journey strategic milestones and must emit events to enable event-driven architecture and business reporting.',
    },
    messages: {
      missingSystemEvent:
        "Action '{{name}}' has scope 'System' but doesn't emit a business event. System scope actions represent cross-journey, system-wide strategic milestones and MUST emit events to signal significant state changes. Events enable event-driven architecture, downstream process triggering, business reporting, and audit trails. Add an emitsEvent field (e.g., 'emitsEvent: \"customer.fully.onboarded\"' following the domain.entity.action format).",
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

          // Only check System scope actions
          if (scope !== 'System') continue;

          // Check if emitsEvent is missing (required)
          if (!emitsEvent) {
            context.report({
              node: decorator.node,
              messageId: 'missingSystemEvent',
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
                  ? `,\n  emitsEvent: '',  // TODO: Business event in domain.entity.action format (e.g., 'customer.fully.onboarded')`
                  : `\n  emitsEvent: '',  // TODO: Business event in domain.entity.action format (e.g., 'customer.fully.onboarded')`;

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

