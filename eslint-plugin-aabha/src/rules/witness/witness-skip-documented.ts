/**
 * Witness Skip Documented Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **skipped witnesses** must be documented to explain why
 * they're skipped. Skipped tests without documentation create confusion - developers and AI
 * systems can't understand why tests are disabled, when they should be re-enabled, or
 * what issues they're tracking.
 *
 * Skip documentation enables AI to:
 * 1. **Understand test status** - Know why tests are skipped
 * 2. **Track technical debt** - Identify tests that need to be fixed
 * 3. **Generate reports** - Create test status reports with skip reasons
 * 4. **Prioritize fixes** - Understand which skipped tests are most important
 *
 * Missing skip documentation means AI can't understand test status or track technical debt.
 *
 * **What it checks:**
 * - Witnesses with `skip: true` have `description` or `scenario` explaining why
 * - Skipped witnesses have documentation about the skip reason
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Skip documented
 * @Witness({
 *   name: 'Payment Test',
 *   skip: true,
 *   description: 'Skipped due to flaky external payment gateway. Re-enable after gateway stability improvements.'
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Skip not documented
 * @Witness({
 *   name: 'Payment Test',
 *   skip: true
 *   // Missing description - why is this skipped?
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'skipNotDocumented';

export const witnessSkipDocumented = createRule<[], MessageIds>({
  name: 'witness-skip-documented',
  meta: {
    type: 'problem',
    docs: {
      description: 'Skipped witnesses should be documented to explain why they are disabled',
    },
    messages: {
      skipNotDocumented: "Witness '{{name}}' is skipped but doesn't have documentation explaining why. Skipped tests without documentation create confusion - developers and AI systems can't understand why tests are disabled, when they should be re-enabled, or what issues they're tracking. Add a description or scenario field explaining the skip reason (e.g., 'description: \"Skipped due to flaky external service. Re-enable after stability improvements.\"').",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        // Check if this method has decorators
        if (!node.decorators || node.decorators.length === 0) return;

        // Find @Witness decorator
        for (const decorator of node.decorators) {
          const parsed = parseAabhaDecorator(decorator);
          if (!parsed || parsed.type !== 'Witness') continue;

          const name = parsed.metadata.name as string | undefined;
          const skip = parsed.metadata.skip as boolean | undefined;

          if (skip !== true) continue;

          const description = parsed.metadata.description as string | undefined;
          const scenario = parsed.metadata.scenario as string | undefined;

          const hasDocumentation = (description && description.trim().length > 0) || (scenario && scenario.trim().length > 0);

          if (!hasDocumentation) {
            context.report({
              node: decorator,
              messageId: 'skipNotDocumented',
              data: { name: name || 'Unnamed witness' },
            });
          }
        }
      },
    };
  },
});
