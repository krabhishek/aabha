/**
 * Expectation Provider-Consumer Distinct Rule
 *
 * **Why this rule exists:**
 * In context engineering, expectations represent **contracts between two distinct stakeholders**:
 * a provider who fulfills the expectation and a consumer who benefits from it. When provider and
 * consumer are the same stakeholder, the expectation becomes **semantically meaningless** - you
 * cannot have an expectation from yourself to yourself. This violates the fundamental contract
 * model and prevents AI systems from understanding stakeholder relationships.
 *
 * Same provider-consumer causes:
 * - **Semantic contradiction** - "I expect myself to do something for myself" is circular
 * - **Modeling confusion** - This should be an internal behavior, not an external expectation
 * - **AI relationship failure** - AI cannot map stakeholder interactions correctly
 * - **Architecture issues** - Wrong component type selected for the requirement
 *
 * Distinct stakeholders enable:
 * 1. **Clear contracts** - Explicit provider-consumer relationships
 * 2. **Proper component selection** - External expectations vs internal behaviors
 * 3. **AI-assisted mapping** - AI can generate correct interaction patterns
 * 4. **Stakeholder analysis** - Can trace dependencies and responsibilities across boundaries
 *
 * **What it checks:**
 * - Provider and consumer reference different stakeholder classes
 * - Prevents self-expectation antipattern
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Distinct provider and consumer
 * @Expectation({
 *   name: 'Fast Account Opening',
 *   provider: BankingSystemStakeholder,  // System provides
 *   consumer: DigitalFirstCustomer,      // Customer benefits
 *   interaction: AccountOpeningAPI
 * })
 * class FastAccountOpeningExpectation {}
 *
 * // ❌ Bad - Same stakeholder as provider and consumer
 * @Expectation({
 *   name: 'Process Own Data',
 *   provider: BankingSystemStakeholder,
 *   consumer: BankingSystemStakeholder,  // Same as provider!
 *   interaction: DataProcessingAPI
 * })
 * class ProcessOwnDataExpectation {}
 * // Semantic error: A stakeholder cannot have an expectation from itself
 * // This should be a @Behavior (internal system process), not an @Expectation
 *
 * // ✅ Better - Use Behavior for internal processes
 * @Behavior({
 *   name: 'Process Data Internally',
 *   // Internal to BankingSystem - no provider/consumer needed
 * })
 * class ProcessDataBehavior {}
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'sameProviderConsumer';

export const expectationProviderConsumerDistinct = createRule<[], MessageIds>({
  name: 'expectation-provider-consumer-distinct',
  meta: {
    type: 'problem',
    docs: {
      description: 'Provider and consumer stakeholders must be different in expectations. In context engineering, expectations represent contracts between distinct stakeholders - a stakeholder cannot have an expectation from itself to itself. Same provider-consumer indicates wrong component selection (use Behavior instead).',
    },
    messages: {
      sameProviderConsumer: "Expectation '{{expectationName}}' has the same stakeholder '{{stakeholderName}}' as both provider and consumer. In context engineering, expectations represent contracts between two distinct stakeholders - one who provides (fulfills) and one who consumes (benefits). When provider and consumer are the same, the expectation becomes semantically meaningless: a stakeholder cannot expect something from itself. This indicates incorrect component modeling - internal processes should use @Behavior decorators (which represent internal system logic), not @Expectation decorators (which represent external contracts between parties). AI systems cannot map stakeholder relationships correctly when self-expectations exist. Refactor this as a Behavior if it's an internal process, or identify the actual distinct provider and consumer stakeholders.",
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
          if (decorator.type !== 'Expectation') continue;

          const expectationName = decorator.metadata.name as string | undefined;
          const provider = decorator.metadata.provider as any;
          const consumer = decorator.metadata.consumer as any;

          // If either is missing, schema validation will catch it
          if (!provider || !consumer) continue;

          // Extract stakeholder names for comparison
          // Handle both direct class references and object references
          let providerName: string | undefined;
          let consumerName: string | undefined;

          // Try to get name from function (class reference)
          if (typeof provider === 'function') {
            providerName = provider.name;
          } else if (provider && typeof provider === 'object' && 'name' in provider) {
            providerName = provider.name;
          }

          if (typeof consumer === 'function') {
            consumerName = consumer.name;
          } else if (consumer && typeof consumer === 'object' && 'name' in consumer) {
            consumerName = consumer.name;
          }

          // Check if provider and consumer are the same
          if (providerName && consumerName && providerName === consumerName) {
            context.report({
              node: decorator.node,
              messageId: 'sameProviderConsumer',
              data: {
                expectationName: expectationName || 'Unknown',
                stakeholderName: providerName,
              },
            });
          }
        }
      },
    };
  },
});
