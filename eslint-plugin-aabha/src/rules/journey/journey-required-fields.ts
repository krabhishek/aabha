/**
 * Journey Required Fields Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, journeys must have core required fields (name, primaryStakeholder)
 * to be valid and actionable. These fields define the fundamental identity of a journey: WHAT it's called (name)
 * and WHO drives it (primaryStakeholder). Without these fields, journeys are incomplete and AI systems cannot
 * properly model or understand them.
 *
 * Required fields enable AI to:
 * 1. **Understand journey identity** - Name defines what the journey is
 * 2. **Know the primary actor** - PrimaryStakeholder defines who drives the journey
 * 3. **Generate user flows** - PrimaryStakeholder enables persona-based flow generation
 * 4. **Model relationships** - Core fields enable relationship and dependency modeling
 *
 * Missing required fields means journeys cannot be properly integrated into the context engineering model.
 *
 * **What it checks:**
 * - Journeys have `name` field (string)
 * - Journeys have `primaryStakeholder` field (reference to @Stakeholder)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - All required fields present
 * @Journey({
 *   name: 'Instant Account Opening',
 *   primaryStakeholder: DigitalCustomerStakeholder
 * })
 * export class InstantAccountOpeningJourney {}
 *
 * // ❌ Bad - Missing required fields
 * @Journey({
 *   name: 'Instant Account Opening'
 *   // Missing primaryStakeholder
 * })
 * export class InstantAccountOpeningJourney {}
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingName' | 'missingPrimaryStakeholder';

export const journeyRequiredFields = createRule<[], MessageIds>({
  name: 'journey-required-fields',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Journeys must have all required fields: name and primaryStakeholder. These fields define the fundamental identity of a journey.',
    },
    messages: {
      missingName:
        "Journey is missing required 'name' field. Name defines what this journey is called. Add a name field with a clear, descriptive name (e.g., 'name: \"Instant Account Opening\"').",
      missingPrimaryStakeholder:
        "Journey '{{name}}' is missing required 'primaryStakeholder' field. PrimaryStakeholder defines who drives this journey and enables persona-based flow generation. Add a primaryStakeholder field referencing a class decorated with @Stakeholder (e.g., 'primaryStakeholder: DigitalCustomerStakeholder').",
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
          if (decorator.type !== 'Journey') continue;

          const name = decorator.metadata.name as string | undefined;
          const primaryStakeholder = decorator.metadata.primaryStakeholder;

          // Check for missing name
          if (!name) {
            context.report({
              node: decorator.node,
              messageId: 'missingName',
            });
          }

          // Check for missing primaryStakeholder
          if (!primaryStakeholder) {
            context.report({
              node: decorator.node,
              messageId: 'missingPrimaryStakeholder',
              data: { name: name || 'Unnamed journey' },
            });
          }
        }
      },
    };
  },
});

