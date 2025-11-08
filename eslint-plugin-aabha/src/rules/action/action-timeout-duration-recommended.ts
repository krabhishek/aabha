/**
 * Action Timeout Duration Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **timeoutDuration** specifies the maximum time to wait
 * for action completion before considering it failed. Timeout duration is critical for resilience,
 * especially for actions with retries or critical actions. Without timeouts, actions may hang
 * indefinitely, blocking journey progress.
 *
 * Timeout duration enables AI to:
 * 1. **Configure timeouts** - Set appropriate timeout values for action execution
 * 2. **Handle failures** - Know when to consider an action failed
 * 3. **Plan resilience** - Understand action failure scenarios
 * 4. **Optimize workflows** - Identify actions that may be bottlenecks
 *
 * **What it checks:**
 * - Action should have `timeoutDuration` field (recommended, especially for actions with maxRetries or critical actions)
 * - Timeout duration is in ISO 8601 format when provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has timeout duration
 * @Action({
 *   name: 'Verify Identity via API',
 *   timeoutDuration: 'PT2M',
 *   maxRetries: 3
 * })
 *
 * // ⚠️ Warning - Missing timeout (recommended for retries)
 * @Action({
 *   name: 'Verify Identity via API',
 *   maxRetries: 3
 *   // Missing timeoutDuration - should set timeout for retries
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTimeoutDuration' | 'missingTimeoutWithRetries' | 'missingTimeoutForCritical';

export const actionTimeoutDurationRecommended = createRule<[], MessageIds>({
  name: 'action-timeout-duration-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions should have timeoutDuration field. Timeout duration specifies the maximum time to wait for action completion, critical for resilience and especially important for actions with retries or critical actions.',
    },
    messages: {
      missingTimeoutDuration:
        "Action '{{name}}' is missing a 'timeoutDuration' field. Timeout duration specifies the maximum time to wait for action completion before considering it failed. Timeout duration is critical for resilience, especially for actions with retries or critical actions. Add a timeoutDuration field in ISO 8601 format (e.g., 'timeoutDuration: \"PT2M\"' for 2 minutes, 'timeoutDuration: \"PT30S\"' for 30 seconds).",
      missingTimeoutWithRetries:
        "Action '{{name}}' has maxRetries but is missing 'timeoutDuration'. Actions with retries should always have timeout duration to prevent indefinite retries. Add a timeoutDuration field in ISO 8601 format (e.g., 'timeoutDuration: \"PT2M\"').",
      missingTimeoutForCritical:
        "Action '{{name}}' has criticality '{{criticality}}' but is missing 'timeoutDuration'. Critical actions should have timeout duration to prevent indefinite blocking. Add a timeoutDuration field in ISO 8601 format (e.g., 'timeoutDuration: \"PT2M\"').",
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
          const timeoutDuration = decorator.metadata.timeoutDuration as string | undefined;
          const maxRetries = decorator.metadata.maxRetries as number | undefined;
          const criticality = decorator.metadata.criticality as string | undefined;

          // Check if timeoutDuration is missing
          if (!timeoutDuration) {
            // Higher priority warnings for actions with retries or critical actions
            if (maxRetries !== undefined && maxRetries > 0) {
              context.report({
                node: decorator.node,
                messageId: 'missingTimeoutWithRetries',
                data: { name: name || 'Unnamed action' },
                fix(fixer) {
                  const source = context.sourceCode.getText(decorator.node);
                  
                  // Check if timeoutDuration already exists in source to avoid duplicates
                  if (source.includes('timeoutDuration:')) {
                    return null; // Field already exists, don't insert
                  }
                  
                  const closingBraceIndex = source.lastIndexOf('}');
                  if (closingBraceIndex === -1) return null;

                  // Find the text before the closing brace to check if we need a comma
                  const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                  const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                  
                  const timeoutTemplate = needsComma 
                    ? `,\n  timeoutDuration: 'PT2M',  // TODO: ISO 8601 duration (e.g., 'PT2M' for 2 minutes, 'PT30S' for 30 seconds)`
                    : `\n  timeoutDuration: 'PT2M',  // TODO: ISO 8601 duration (e.g., 'PT2M' for 2 minutes, 'PT30S' for 30 seconds)`;

                  return fixer.insertTextAfterRange(
                    [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                    timeoutTemplate,
                  );
                },
              });
              continue;
            }

            if (criticality === 'Critical' || criticality === 'Required') {
              context.report({
                node: decorator.node,
                messageId: 'missingTimeoutForCritical',
                data: {
                  name: name || 'Unnamed action',
                  criticality: criticality || 'unknown',
                },
                fix(fixer) {
                  const source = context.sourceCode.getText(decorator.node);
                  
                  // Check if timeoutDuration already exists in source to avoid duplicates
                  if (source.includes('timeoutDuration:')) {
                    return null; // Field already exists, don't insert
                  }
                  
                  const closingBraceIndex = source.lastIndexOf('}');
                  if (closingBraceIndex === -1) return null;

                  // Find the text before the closing brace to check if we need a comma
                  const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                  const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                  
                  const timeoutTemplate = needsComma 
                    ? `,\n  timeoutDuration: 'PT2M',  // TODO: ISO 8601 duration (e.g., 'PT2M' for 2 minutes, 'PT30S' for 30 seconds)`
                    : `\n  timeoutDuration: 'PT2M',  // TODO: ISO 8601 duration (e.g., 'PT2M' for 2 minutes, 'PT30S' for 30 seconds)`;

                  return fixer.insertTextAfterRange(
                    [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                    timeoutTemplate,
                  );
                },
              });
              continue;
            }

            // General recommendation for other actions
            context.report({
              node: decorator.node,
              messageId: 'missingTimeoutDuration',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if timeoutDuration already exists in source to avoid duplicates
                if (source.includes('timeoutDuration:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const timeoutTemplate = `,\n  timeoutDuration: 'PT2M',  // TODO: ISO 8601 duration (e.g., 'PT2M' for 2 minutes, 'PT30S' for 30 seconds)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  timeoutTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

