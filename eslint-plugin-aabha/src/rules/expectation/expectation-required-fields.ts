/**
 * Expectation Required Fields Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, expectations represent contracts between stakeholders
 * and must have core required fields (name, description, provider, consumer, interaction) to be
 * valid and actionable. These fields define the fundamental contract: WHAT it's called (name),
 * WHAT it means (description), WHO provides it (provider), WHO benefits (consumer), and HOW it's
 * delivered (interaction). Without these fields, expectations are incomplete and AI systems cannot
 * properly model or understand the stakeholder contracts.
 *
 * Required fields enable AI to:
 * 1. **Understand contract identity** - Name and description define what the expectation is
 * 2. **Know the stakeholders** - Provider and consumer define the contract parties
 * 3. **Define delivery mechanism** - Interaction defines how the expectation is fulfilled
 * 4. **Model relationships** - Core fields enable relationship and dependency modeling
 *
 * Missing required fields means expectations cannot be properly integrated into the context
 * engineering model and stakeholder contracts cannot be understood.
 *
 * **What it checks:**
 * - Expectations have `name` field (string)
 * - Expectations have `description` field (string, in Given-When-Then or As-a...I-want format)
 * - Expectations have `provider` field (reference to @Stakeholder)
 * - Expectations have `consumer` field (reference to @Stakeholder)
 * - Expectations have `interaction` field (reference to @Interaction)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - All required fields present
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   description: 'Email validation service validates email format and DNS records in real-time',
 *   provider: EmailValidationServiceStakeholder,
 *   consumer: DigitalCustomerStakeholder,
 *   interaction: EmailValidationAPIInteraction
 * })
 * export class FastEmailValidationExpectation {}
 *
 * // ❌ Bad - Missing required fields
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing description, provider, consumer, interaction
 * })
 * export class FastEmailValidationExpectation {}
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingName'
  | 'missingDescription'
  | 'missingProvider'
  | 'missingConsumer'
  | 'missingInteraction';

export const expectationRequiredFields = createRule<[], MessageIds>({
  name: 'expectation-required-fields',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Expectations must have all required fields: name, description, provider, consumer, and interaction. These fields define the fundamental stakeholder contract.',
    },
    messages: {
      missingName:
        "Expectation is missing required 'name' field. Name defines what this expectation is called. Add a name field with a clear, descriptive name (e.g., 'name: \"Fast Email Validation\"').",
      missingDescription:
        "Expectation '{{name}}' is missing required 'description' field. Description explains what the expectation means, written in Given-When-Then or As-a...I-want...So-that format. Add a description field (e.g., 'description: \"Given a valid account, When depositing money, Then balance should increase\"').",
      missingProvider:
        "Expectation '{{name}}' is missing required 'provider' field. Provider defines who fulfills/implements this expectation. Add a provider field referencing a class decorated with @Stakeholder (e.g., 'provider: BankingSystemStakeholder').",
      missingConsumer:
        "Expectation '{{name}}' is missing required 'consumer' field. Consumer defines who benefits from this expectation. Add a consumer field referencing a class decorated with @Stakeholder (e.g., 'consumer: DigitalCustomerStakeholder').",
      missingInteraction:
        "Expectation '{{name}}' is missing required 'interaction' field. Interaction defines how this expectation is delivered (the technical contract). Add an interaction field referencing a class decorated with @Interaction (e.g., 'interaction: EmailValidationAPIInteraction').",
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
          if (decorator.type !== 'Expectation') continue;

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description;
          const provider = decorator.metadata.provider;
          const consumer = decorator.metadata.consumer;
          const interaction = decorator.metadata.interaction;

          // Check for missing name
          if (!name) {
            context.report({
              node: decorator.node,
              messageId: 'missingName',
            });
          }

          // Check for missing description
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing provider
          if (!provider) {
            context.report({
              node: decorator.node,
              messageId: 'missingProvider',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing consumer
          if (!consumer) {
            context.report({
              node: decorator.node,
              messageId: 'missingConsumer',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing interaction
          if (!interaction) {
            context.report({
              node: decorator.node,
              messageId: 'missingInteraction',
              data: { name: name || 'Unnamed expectation' },
            });
          }
        }
      },
    };
  },
});

