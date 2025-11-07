/**
 * Expectation Verification Level Coverage Rule
 *
 * **Why this rule exists:**
 * In context engineering, verification levels define **how strictly expectations are validated**
 * in production, ranging from advisory (optional) to audited (mandatory with high coverage).
 * Each verification level implies minimum test coverage and acceptance testing requirements.
 * Misaligned verification configurations create false confidence - you think an expectation is
 * "enforced" but lack the test coverage to actually verify it works.
 *
 * Insufficient verification coverage causes:
 * - **False enforcement** - "Enforced" expectations with 20% test coverage aren't truly enforced
 * - **Production surprises** - Uncovered edge cases break in production
 * - **AI training gaps** - AI cannot learn behavior patterns from untested scenarios
 * - **Compliance failures** - Audited expectations require high coverage for regulatory compliance
 *
 * Aligned verification enables:
 * 1. **Honest enforcement** - Verification level matches actual test rigor
 * 2. **Predictable behavior** - High coverage ensures AI can predict system behavior
 * 3. **Confident deployment** - Teams know expectations are thoroughly validated
 * 4. **Regulatory compliance** - Audited expectations meet coverage requirements
 *
 * **Coverage requirements by level:**
 * - **advisory**: No minimum (0%) - suggestions only, not enforced
 * - **monitored**: ≥50% coverage - observed in production, some testing
 * - **enforced**: ≥75% coverage + acceptance testing - strict validation required
 * - **audited**: ≥90% coverage + acceptance testing - regulatory compliance level
 *
 * **What it checks:**
 * - Verification.testCoverage.minWitnessCoverage meets level requirements
 * - Enforced and audited levels require acceptanceTesting configuration
 * - Warns when coverage is insufficient for declared verification level
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Enforced with sufficient coverage
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   verificationLevel: ExpectationVerificationLevel.Enforced,
 *   verification: {
 *     level: ExpectationVerificationLevel.Enforced,
 *     testCoverage: {
 *       minWitnessCoverage: 85, // ≥75% required for enforced
 *       requiredScenarios: {
 *         happyPath: true,
 *         errorScenarios: ['invalid-format', 'dns-timeout']
 *       }
 *     },
 *     acceptanceTesting: {
 *       required: true,
 *       automationLevel: 'full'
 *     }
 *   }
 * })
 *
 * // ❌ Bad - Enforced but insufficient coverage
 * @Expectation({
 *   name: 'Critical Payment Processing',
 *   verificationLevel: ExpectationVerificationLevel.Enforced,
 *   verification: {
 *     level: ExpectationVerificationLevel.Enforced,
 *     testCoverage: {
 *       minWitnessCoverage: 40 // Only 40%! Need ≥75% for enforced
 *     }
 *   }
 * })
 * // Problem: Declared "enforced" but only 40% covered - false confidence
 *
 * // ❌ Bad - Audited without acceptance testing
 * @Expectation({
 *   name: 'Regulatory Compliance Check',
 *   verificationLevel: ExpectationVerificationLevel.Audited,
 *   verification: {
 *     level: ExpectationVerificationLevel.Audited,
 *     testCoverage: {
 *       minWitnessCoverage: 95
 *     }
 *     // Missing acceptanceTesting! Required for audited level
 *   }
 * })
 *
 * // ✅ Good - Advisory with minimal coverage (acceptable for this level)
 * @Expectation({
 *   name: 'Experimental Feature',
 *   verificationLevel: ExpectationVerificationLevel.Advisory,
 *   verification: {
 *     level: ExpectationVerificationLevel.Advisory,
 *     testCoverage: {
 *       minWitnessCoverage: 20 // OK for advisory - just a suggestion
 *     }
 *   }
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'insufficientCoverage' | 'missingAcceptanceTesting';

/**
 * Minimum coverage requirements by verification level
 */
const MIN_COVERAGE_BY_LEVEL: Record<string, number> = {
  advisory: 0,
  monitored: 50,
  enforced: 75,
  audited: 90,
};

export const expectationVerificationLevelCoverage = createRule<[], MessageIds>({
  name: 'expectation-verification-level-coverage',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Verification level must align with test coverage requirements. In context engineering, verification levels imply minimum coverage thresholds - enforced (≥75%), audited (≥90%). Insufficient coverage creates false confidence that expectations are properly validated.',
    },
    messages: {
      insufficientCoverage: "Expectation '{{expectationName}}' has verification level '{{level}}' which requires at least {{required}}% test coverage, but only has {{actual}}%. In context engineering, verification levels represent enforcement strictness - declaring an expectation '{{level}}' without adequate test coverage creates false confidence. The system appears validated but lacks the test rigor to catch issues before production. Higher verification levels require more thorough testing: advisory (0%), monitored (≥50%), enforced (≥75%), audited (≥90%). Increase minWitnessCoverage to meet the {{required}}% threshold, or lower the verification level to match your actual test coverage. AI systems rely on these coverage guarantees to predict system reliability.",
      missingAcceptanceTesting: "Expectation '{{expectationName}}' has verification level '{{level}}' which requires acceptance testing configuration, but acceptanceTesting is missing. In context engineering, 'enforced' and 'audited' verification levels represent strict validation requirements that must include end-to-end acceptance testing beyond unit tests. Enforced expectations need acceptance testing to validate real-world scenarios. Audited expectations require it for regulatory compliance and governance. Without acceptance testing configuration, AI systems cannot verify the expectation is properly validated in realistic conditions. Add verification.acceptanceTesting with required: true and appropriate automation level, or lower the verification level if acceptance testing is not feasible.",
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

          const expectationName = decorator.metadata.name as string | undefined;
          const verification = decorator.metadata.verification as any | undefined;
          const verificationLevel = decorator.metadata.verificationLevel as string | undefined;

          // If no verification config or level, skip
          if (!verification || !verificationLevel) continue;

          const level = verificationLevel.toLowerCase();
          const requiredCoverage = MIN_COVERAGE_BY_LEVEL[level];

          // Check test coverage alignment
          const testCoverage = verification.testCoverage;
          const actualCoverage = testCoverage?.minWitnessCoverage as number | undefined;

          if (actualCoverage !== undefined && requiredCoverage !== undefined && actualCoverage < requiredCoverage) {
            context.report({
              node: decorator.node,
              messageId: 'insufficientCoverage',
              data: {
                expectationName: expectationName || 'Unknown',
                level: verificationLevel,
                required: requiredCoverage.toString(),
                actual: actualCoverage.toString(),
              },
              fix(fixer) {
                // Access the decorator's expression to find verification.testCoverage.minWitnessCoverage
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the verification property
                const verificationProp = arg.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'verification'
                );

                if (!verificationProp || verificationProp.value.type !== 'ObjectExpression') return null;

                // Find the testCoverage property
                const testCoverageProp = verificationProp.value.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'testCoverage'
                );

                if (!testCoverageProp || testCoverageProp.value.type !== 'ObjectExpression') return null;

                // Find the minWitnessCoverage property
                const minWitnessCoverageProp = testCoverageProp.value.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'minWitnessCoverage'
                );

                if (!minWitnessCoverageProp) return null;

                // Replace the value with the required coverage
                const valueNode = minWitnessCoverageProp.value;
                return fixer.replaceTextRange(valueNode.range, requiredCoverage.toString());
              },
            });
          }

          // Check acceptance testing requirement for enforced/audited
          if ((level === 'enforced' || level === 'audited') && !verification.acceptanceTesting) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingAcceptanceTesting',
              data: {
                expectationName: expectationName || 'Unknown',
                level: verificationLevel,
              },
              fix(fixer) {
                // Access the decorator's expression to find verification object
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the verification property
                const verificationProp = arg.properties.find(
                  (prop): prop is TSESTree.Property =>
                    prop.type === 'Property' &&
                    prop.key.type === 'Identifier' &&
                    prop.key.name === 'verification'
                );

                if (!verificationProp || verificationProp.value.type !== 'ObjectExpression') return null;

                // Find the last property in verification object to insert after
                const properties = verificationProp.value.properties;
                if (properties.length === 0) return null;

                const lastProperty = properties[properties.length - 1];
                const indentation = detectIndentation(lastProperty, sourceCode);
                const insertPosition = lastProperty.range[1];

                // Add acceptanceTesting skeleton
                const acceptanceTestingConfig = `,\n${indentation}acceptanceTesting: {\n${indentation}  required: true,\n${indentation}  automationLevel: 'TODO: Specify automation level (none/partial/full)'\n${indentation}}`;

                return fixer.insertTextAfterRange([insertPosition, insertPosition], acceptanceTestingConfig);
              },
            });
          }
        }
      },
    };
  },
});
