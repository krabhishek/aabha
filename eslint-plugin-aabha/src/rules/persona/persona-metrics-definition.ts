/**
 * Persona Metrics Definition Rule
 *
 * **Why this rule exists:**
 * Personas need measurable success indicators to validate designs and track satisfaction. In context
 * engineering, metrics make personas actionable by defining what success looks like - how to measure
 * if persona needs are met, engagement is high, and satisfaction is achieved. Without metrics, teams
 * cannot validate persona-driven designs or detect problems early.
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMetrics';

export const personaMetricsDefinition = createRule<[], MessageIds>({
  name: 'persona-metrics-definition',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have metrics defined. In context engineering, metrics enable validation of persona-driven designs and track satisfaction.',
    },
    messages: {
      missingMetrics:
        "Persona '{{personaName}}' lacks metrics field. In context engineering, personas need measurable success indicators to validate designs. Add metrics field with successIndicators, engagementPatterns, satisfactionSignals, or churnRisks. Example: metrics: {{ successIndicators: ['Achieves savings goals', 'Feels confident about finances'], engagementPatterns: ['Daily active user', 'Uses 5+ features'], satisfactionSignals: ['Recommends to friends', 'Positive reviews'], churnRisks: ['Slow app performance', 'Hidden fees'] }}. Without metrics, teams cannot measure if persona needs are met or detect problems early.",
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
          if (decorator.type !== 'Persona') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const metrics = decorator.metadata.metrics as
            | {
                successIndicators?: string[];
                engagementPatterns?: string[];
                satisfactionSignals?: string[];
                churnRisks?: string[];
              }
            | undefined;

          // Check if metrics is missing or has no meaningful content
          if (
            !metrics ||
            (!metrics.successIndicators &&
              !metrics.engagementPatterns &&
              !metrics.satisfactionSignals &&
              !metrics.churnRisks)
          ) {
            context.report({
              node: decorator.node,
              messageId: 'missingMetrics',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const metricsTemplate = `,\n  metrics: {\n    successIndicators: [''], // TODO: How to measure if persona is successful/satisfied?\n    satisfactionSignals: [''], // TODO: Observable signals that persona is happy?\n    churnRisks: [''] // TODO: Warning signs that persona might leave?\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  metricsTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});
