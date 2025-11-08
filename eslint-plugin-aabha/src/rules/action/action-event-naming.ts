/**
 * Action Event Naming Rule
 *
 * **Why this rule exists:**
 * In event-driven architectures and Aabha's context engineering framework, domain events are
 * **permanent historical records** of business state changes. Event names become part of your
 * system's ubiquitous language - they appear in event stores, logs, monitoring dashboards, and
 * documentation. Poor event naming creates technical debt and reduces AI comprehension.
 *
 * Well-named events following the `domain.entity.action` convention with past-tense verbs create
 * self-documenting systems that AI can understand:
 * 1. **Events describe facts, not commands** - Past tense signals "this happened" vs "do this"
 * 2. **Domain language alignment** - Events match business terminology, helping AI understand
 *    business processes and generate accurate event handlers
 * 3. **Searchability and traceability** - Consistent naming enables AI to trace event flows
 *    and understand system behavior patterns
 * 4. **Integration clarity** - Other systems/AI assistants can understand what happened by
 *    reading event names alone
 *
 * **What it checks:**
 * - Event names use past tense verbs (e.g., "created", "verified", "completed")
 * - Avoids vague verbs like "changed", "modified", "processed" (be specific!)
 * - Suggests alignment between action name and event verb
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Past tense, specific, clear business meaning
 * @Action({
 *   name: 'Verify Email',
 *   emitsEvent: 'account.email.verified'  // Past tense, specific
 * })
 * @Action({
 *   name: 'Create Order',
 *   emitsEvent: 'order.purchase.created'
 * })
 *
 * // ❌ Bad - Not past tense
 * @Action({
 *   emitsEvent: 'account.email.verify'  // Should be 'verified'
 * })
 *
 * // ❌ Bad - Vague verb
 * @Action({
 *   emitsEvent: 'account.user.changed'  // What changed? Use 'updated', 'activated', etc.
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

/**
 * Common past tense verbs for domain events
 */
const PAST_TENSE_VERBS = new Set([
  'created', 'updated', 'deleted', 'verified', 'approved', 'rejected',
  'submitted', 'completed', 'cancelled', 'activated', 'deactivated',
  'sent', 'received', 'issued', 'revoked', 'expired', 'renewed',
  'opened', 'closed', 'started', 'stopped', 'paused', 'resumed',
  'registered', 'unregistered', 'added', 'removed', 'assigned', 'unassigned',
  'charged', 'refunded', 'captured', 'authorized', 'settled',
]);

/**
 * Vague verbs that should be more specific
 */
const VAGUE_VERBS = new Set([
  'changed', 'modified', 'processed', 'handled', 'done', 'finished',
]);

/**
 * Suggest past tense version of a verb (simple heuristic)
 */
function suggestPastTense(verb: string): string {
  if (PAST_TENSE_VERBS.has(verb)) {
    return verb;
  }

  // Simple heuristics for common patterns
  if (verb.endsWith('e')) {
    return verb + 'd';
  } else if (verb.endsWith('y')) {
    return verb.slice(0, -1) + 'ied';
  } else {
    return verb + 'ed';
  }
}

/**
 * Convert past tense verb to base form for comparison with action names
 * Examples: "started" -> "start", "submitted" -> "submit", "created" -> "create"
 */
function pastTenseToBase(verb: string): string {
  // Handle common irregular past tense verbs
  const irregularMap: Record<string, string> = {
    'sent': 'send',
    'received': 'receive',
    'done': 'do',
    'gone': 'go',
    'taken': 'take',
    'given': 'give',
    'written': 'write',
    'spoken': 'speak',
    'broken': 'break',
    'chosen': 'choose',
    'frozen': 'freeze',
    'stolen': 'steal',
    'thrown': 'throw',
    'known': 'know',
    'grown': 'grow',
    'shown': 'show',
    'drawn': 'draw',
  };

  if (irregularMap[verb]) {
    return irregularMap[verb];
  }

  // Handle regular past tense patterns
  if (verb.endsWith('ied')) {
    // Verbs ending in "y" become "ied" (e.g., "verified" -> "verify")
    // But "submitted" doesn't follow this pattern - it's "submit" + "ted"
    // Check if it's actually a doubled consonant case
    const withoutEd = verb.slice(0, -3);
    if (withoutEd.length > 1 && withoutEd[withoutEd.length - 1] === withoutEd[withoutEd.length - 2]) {
      // Doubled consonant case (e.g., "submitted" -> "submitt" -> "submit")
      return withoutEd.slice(0, -1);
    }
    // Regular "ied" case (e.g., "verified" -> "verify")
    return withoutEd + 'y';
  } else if (verb.endsWith('ed')) {
    // Remove "ed" suffix
    const base = verb.slice(0, -2);
    // Handle doubled consonants (e.g., "stopped" -> "stop", "submitted" -> "submit")
    if (base.length > 1 && base[base.length - 1] === base[base.length - 2]) {
      return base.slice(0, -1);
    }
    // Handle verbs ending in "e" that add "d" (e.g., "created" -> "create")
    if (base.endsWith('e')) {
      return base; // "created" -> "create"
    }
    return base; // "started" -> "start"
  }

  // If not past tense pattern, return as-is
  return verb;
}

type MessageIds = 'notPastTense' | 'vagueVerb' | 'nameAlignment';

export const actionEventNaming = createRule<[], MessageIds>({
  name: 'action-event-naming',
  meta: {
    type: 'problem',
    docs: {
      description: 'Domain events should use past tense verbs to signal historical facts. Well-named events create self-documenting systems that AI can comprehend and trace.',
    },
    messages: {
      notPastTense: "Event '{{event}}' uses '{{verb}}' which may not be past tense. Domain events are historical facts that already happened - they should use past tense verbs (e.g., 'created', 'verified', 'completed'). This helps AI systems understand event semantics and distinguish events (facts) from commands (requests). Consider: {{suggestion}}",
      vagueVerb: "Event '{{event}}' uses vague verb '{{verb}}'. Generic verbs like 'changed' or 'modified' lose valuable context about what actually happened. Be specific to help AI comprehend your business events (e.g., use 'updated', 'verified', 'activated' instead of 'changed'). Specific event names improve observability and AI-assisted debugging.",
      nameAlignment: "Event '{{event}}' doesn't align with action name '{{actionName}}'. Aligning event verbs with action names creates consistent ubiquitous language that helps AI trace business processes. When action and event names diverge, AI assistants struggle to understand the relationship between commands and their resulting events.",
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

          const emitsEvent = decorator.metadata.emitsEvent as string | undefined;
          if (!emitsEvent) continue;

          const eventParts = emitsEvent.split('.');

          // Schema validates this, but double-check
          if (eventParts.length !== 3) continue;

          const [domain, entity, verb] = eventParts;
          const actionName = decorator.metadata.name as string | undefined;

          // Check if verb is past tense
          if (!PAST_TENSE_VERBS.has(verb) && !verb.endsWith('ed')) {
            const suggestion = `${domain}.${entity}.${suggestPastTense(verb)}`;

            context.report({
              node: decorator.node,
              messageId: 'notPastTense',
              data: {
                event: emitsEvent,
                verb,
                suggestion,
              },
            });
          }

          // Check for vague verbs
          if (VAGUE_VERBS.has(verb)) {
            context.report({
              node: decorator.node,
              messageId: 'vagueVerb',
              data: {
                event: emitsEvent,
                verb,
              },
            });
          }

          // Suggest alignment with action name
          // Check if action name contains the base verb form (not past tense)
          if (actionName) {
            const actionNameLower = actionName.toLowerCase();
            const baseVerb = pastTenseToBase(verb).toLowerCase();
            
            // Check if action name contains either the base verb or the past tense verb
            // This handles cases like "Start Account" with event "account.application.started"
            if (!actionNameLower.includes(baseVerb) && !actionNameLower.includes(verb)) {
              context.report({
                node: decorator.node,
                messageId: 'nameAlignment',
                data: {
                  event: emitsEvent,
                  actionName,
                },
              });
            }
          }
        }
      },
    };
  },
});
