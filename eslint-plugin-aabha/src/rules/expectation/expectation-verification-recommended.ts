/**
 * Expectation Verification Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **verification** defines how expectations are validated
 * through testing and monitoring. Verification configuration specifies test coverage requirements,
 * required test scenarios, and acceptance testing approaches. Without verification, expectations
 * lack clear validation criteria, making it impossible to ensure they are properly tested and
 * validated before deployment.
 *
 * Verification enables AI to:
 * 1. **Define test requirements** - Specify minimum test coverage and required scenarios
 * 2. **Generate test code** - AI can generate test implementations from verification requirements
 * 3. **Ensure quality gates** - Verification levels enforce testing rigor
 * 4. **Enable compliance** - Audited expectations require high coverage for regulatory compliance
 *
 * Missing verification makes it unclear how expectations should be tested or validated.
 *
 * **What it checks:**
 * - Expectation has `verification` field defined (recommended)
 * - Verification should include test coverage requirements
 * - Verification should align with verificationLevel if specified
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has verification configuration
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   verificationLevel: ExpectationVerificationLevel.Enforced,
 *   verification: {
 *     level: ExpectationVerificationLevel.Enforced,
 *     testCoverage: {
 *       minWitnessCoverage: 80,
 *       requiredScenarios: {
 *         happyPath: true,
 *         errorScenarios: ['invalid-format', 'dns-timeout']
 *       }
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing verification configuration
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   verificationLevel: ExpectationVerificationLevel.Enforced
 *   // Missing verification - unclear how to validate this expectation
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingVerification';

export const expectationVerificationRecommended = createRule<[], MessageIds>({
  name: 'expectation-verification-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have verification field. Verification defines test coverage requirements and validation approaches for ensuring expectations are properly tested.',
    },
    messages: {
      missingVerification:
        "Expectation '{{name}}' is missing a 'verification' field. Verification defines how this expectation should be validated through testing, including test coverage requirements and required test scenarios. Consider adding verification configuration (e.g., 'verification: { level: ExpectationVerificationLevel.Enforced, testCoverage: { minWitnessCoverage: 80, requiredScenarios: { happyPath: true } } }').",
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
          const verification = decorator.metadata.verification;
          const verificationLevel = decorator.metadata.verificationLevel;

          // Check if verification is missing (especially important if verificationLevel is set)
          if (!verification) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if verification already exists in source to avoid duplicates
            if (source.includes('verification:')) {
              continue;
            }

            // Stronger recommendation if verificationLevel is set
            const hasVerificationLevel = !!verificationLevel;

            context.report({
              node: decorator.node,
              messageId: 'missingVerification',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if verification already exists in source to avoid duplicates
                if (source.includes('verification:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const verificationTemplate = needsComma
                  ? `,\n  verification: {\n    level: ${hasVerificationLevel ? 'ExpectationVerificationLevel.Enforced' : 'undefined'},  // TODO: Set verification level\n    testCoverage: {\n      minWitnessCoverage: 80,  // TODO: Set minimum test coverage\n      requiredScenarios: {\n        happyPath: true,\n        errorScenarios: [],  // TODO: Add error scenarios\n        edgeCases: []  // TODO: Add edge cases\n      }\n    }\n  },  // TODO: Define test coverage and validation requirements`
                  : `\n  verification: {\n    level: ${hasVerificationLevel ? 'ExpectationVerificationLevel.Enforced' : 'undefined'},  // TODO: Set verification level\n    testCoverage: {\n      minWitnessCoverage: 80,  // TODO: Set minimum test coverage\n      requiredScenarios: {\n        happyPath: true,\n        errorScenarios: [],  // TODO: Add error scenarios\n        edgeCases: []  // TODO: Add edge cases\n      }\n    }\n  },  // TODO: Define test coverage and validation requirements`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  verificationTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

