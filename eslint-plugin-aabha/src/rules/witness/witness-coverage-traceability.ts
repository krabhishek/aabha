/**
 * Witness Coverage Traceability Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **coverage traceability** links witnesses to requirements,
 * tickets, and documentation. High-risk witnesses without traceability create gaps in test
 * coverage tracking. AI systems need traceability information to generate coverage reports,
 * link tests to requirements, and understand test purpose.
 *
 * Coverage traceability enables AI to:
 * 1. **Generate coverage reports** - Link tests to requirements and tickets
 * 2. **Track test purpose** - Understand why tests exist
 * 3. **Identify gaps** - Find requirements without test coverage
 * 4. **Generate documentation** - Create test documentation with traceability links
 *
 * Missing traceability means AI can't link tests to requirements or generate coverage reports.
 *
 * **What it checks:**
 * - Witnesses with `coverage.riskLevel: 'high'` have traceability information
 * - High-risk witnesses have `requirements` or `tickets` or `traceabilityUrl`
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Traceability for high-risk witness
 * @Witness({
 *   name: 'Payment Processing Test',
 *   coverage: {
 *     riskLevel: WitnessRiskLevel.High,
 *     requirements: ['REQ-PAY-001'],
 *     tickets: ['JIRA-1234'],
 *     traceabilityUrl: 'https://wiki.company.com/specs/payment'
 *   }
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - High-risk witness without traceability
 * @Witness({
 *   name: 'Payment Processing Test',
 *   coverage: {
 *     riskLevel: WitnessRiskLevel.High
 *     // Missing requirements, tickets, traceabilityUrl
 *   }
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'highRiskMissingTraceability';

export const witnessCoverageTraceability = createRule<[], MessageIds>({
  name: 'witness-coverage-traceability',
  meta: {
    type: 'problem',
    docs: {
      description: 'High-risk witnesses should have traceability information linking to requirements, tickets, or documentation',
    },
    messages: {
      highRiskMissingTraceability: "High-risk witness '{{name}}' is missing traceability information. High-risk witnesses should have requirements, tickets, or traceabilityUrl to enable coverage tracking and link tests to business requirements. Add at least one of: requirements array (e.g., 'requirements: [\"REQ-PAY-001\"]'), tickets array (e.g., 'tickets: [\"JIRA-1234\"]'), or traceabilityUrl (e.g., 'traceabilityUrl: \"https://wiki.company.com/specs/payment\"').",
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
          const coverage = parsed.metadata.coverage as Record<string, unknown> | undefined;

          if (!coverage) continue;

          const riskLevel = coverage.riskLevel as string | undefined;
          if (!riskLevel) continue;

          const riskLower = riskLevel.toLowerCase();
          const isHighRisk = riskLower.includes('high') || riskLower === 'high';

          if (!isHighRisk) continue;

          // Check for traceability information
          const requirements = coverage.requirements;
          const tickets = coverage.tickets;
          const traceabilityUrl = coverage.traceabilityUrl;

          const hasRequirements = requirements && Array.isArray(requirements) && requirements.length > 0;
          const hasTickets = tickets && Array.isArray(tickets) && tickets.length > 0;
          const hasTraceabilityUrl = traceabilityUrl && typeof traceabilityUrl === 'string' && traceabilityUrl.trim().length > 0;

          if (!hasRequirements && !hasTickets && !hasTraceabilityUrl) {
            context.report({
              node: decorator,
              messageId: 'highRiskMissingTraceability',
              data: { name: name || 'Unnamed witness' },
            });
          }
        }
      },
    };
  },
});
