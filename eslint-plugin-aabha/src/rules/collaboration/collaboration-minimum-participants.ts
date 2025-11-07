/**
 * Collaboration Minimum Participants Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **collaborations by definition involve multiple stakeholders**.
 * A "collaboration" with zero or one participant is a contradiction - that's an individual action or
 * behavior, not a collaboration. This rule ensures proper component selection.
 *
 * Single-participant "collaborations" cause:
 * - **Modeling confusion** - Is this really a collaboration or should it be an Action?
 * - **Architecture issues** - Collaboration infrastructure for individual tasks
 * - **AI misunderstanding** - AI expects multi-party dynamics but finds solo work
 * - **Overhead waste** - Collaboration scaffolding (scheduling, decisions, artifacts) for one person
 *
 * Proper participant modeling enables:
 * 1. **Correct component type** - Solo work uses Action/Behavior, multi-party uses Collaboration
 * 2. **Appropriate tooling** - AI suggests individual task tools vs collaboration tools
 * 3. **Realistic planning** - Multi-party collaborations need coordination time
 * 4. **Clear semantics** - Code structure matches business reality
 *
 * **What it checks:**
 * - All Collaboration components have at least 2 participants
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Multiple participants
 * @Collaboration({
 *   name: 'Sprint Planning',
 *   participants: [
 *     { stakeholder: 'Product Owner', role: 'decision-maker' },
 *     { stakeholder: 'Development Team', role: 'estimator' }
 *   ]
 * })
 *
 * // ❌ Bad - No participants
 * @Collaboration({
 *   name: 'Review Code'
 * })
 *
 * // ❌ Bad - Single participant (use @Action instead)
 * @Collaboration({
 *   name: 'Write Report',
 *   participants: [
 *     { stakeholder: 'Analyst', role: 'author' }
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'insufficientParticipants';

export const collaborationMinimumParticipants = createRule<[], MessageIds>({
  name: 'collaboration-minimum-participants',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaborations must have at least 2 participants. In context engineering, collaborations by definition involve multiple stakeholders - single-participant activities should use Action or Behavior components instead.',
    },
    messages: {
      insufficientParticipants: "Collaboration '{{collaborationName}}' has {{count}} participant(s). In context engineering, collaborations require at least 2 participants by definition - they represent multi-stakeholder interactions, meetings, reviews, or decisions. Single-participant work should use @Action (user-initiated task) or @Behavior (system process) decorators instead. This distinction helps AI systems understand whether coordination, scheduling, and consensus mechanisms are needed.",
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
          if (decorator.type !== 'Collaboration') continue;

          const collaborationName = decorator.metadata.name as string | undefined;
          const participants = decorator.metadata.participants as unknown[] | undefined;
          const count = participants?.length || 0;

          if (count < 2) {
            context.report({
              node: decorator.node,
              messageId: 'insufficientParticipants',
              data: {
                collaborationName: collaborationName || 'Unknown',
                count: count.toString(),
              },
            });
          }
        }
      },
    };
  },
});
