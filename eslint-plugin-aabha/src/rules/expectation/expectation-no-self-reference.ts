/**
 * Expectation No Self-Reference Rule
 *
 * **Why this rule exists:**
 * In context engineering, expectations represent **contracts between stakeholders** with clear
 * dependency and conflict relationships. An expectation that references itself in `dependsOn` or
 * `conflictsWith` creates a **logical impossibility** that breaks the dependency graph and
 * prevents AI systems from reasoning about execution order and conflict resolution.
 *
 * Self-references cause:
 * - **Circular logic paradox** - An expectation cannot depend on itself to be fulfilled
 * - **Graph traversal failure** - Dependency resolution algorithms enter infinite loops
 * - **AI reasoning breakdown** - AI cannot determine execution order or precedence
 * - **Semantic contradiction** - "Conflicts with itself" is meaningless
 *
 * Preventing self-references enables:
 * 1. **Valid dependency graphs** - Directed acyclic graphs (DAGs) can be constructed
 * 2. **AI-assisted planning** - AI can generate valid execution plans and sequences
 * 3. **Conflict resolution** - Clear conflict sets enable proper constraint satisfaction
 * 4. **Traceable lineage** - Dependencies form meaningful chains without cycles
 *
 * Note: This rule catches direct self-references. Circular dependencies involving multiple
 * expectations (A depends on B depends on A) are caught by separate circular dependency detection.
 *
 * **What it checks:**
 * - `dependsOn` array does not contain a reference to the expectation itself
 * - `conflictsWith` array does not contain a reference to the expectation itself
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Depends on other expectations
 * @Expectation({
 *   name: 'Complete KYC Verification',
 *   dependsOn: [DocumentUploadExpectation, IdentityCheckExpectation]
 * })
 * class CompleteKYCVerificationExpectation {}
 *
 * // ❌ Bad - Self-dependency creates logical impossibility
 * @Expectation({
 *   name: 'Complete KYC Verification',
 *   dependsOn: [CompleteKYCVerificationExpectation] // References itself!
 * })
 * class CompleteKYCVerificationExpectation {}
 * // Logical contradiction: "Cannot complete KYC until KYC is complete"
 *
 * // ❌ Bad - Self-conflict is meaningless
 * @Expectation({
 *   name: 'High-Speed Processing',
 *   conflictsWith: [HighSpeedProcessingExpectation] // Conflicts with itself!
 * })
 * class HighSpeedProcessingExpectation {}
 * // Semantic error: An expectation cannot conflict with itself
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'selfDependency' | 'selfConflict';

export const expectationNoSelfReference = createRule<[], MessageIds>({
  name: 'expectation-no-self-reference',
  meta: {
    type: 'problem',
    docs: {
      description: 'Expectations cannot depend on or conflict with themselves. In context engineering, self-references create logical contradictions that break dependency graphs and prevent AI systems from reasoning about execution order and conflict resolution.',
    },
    messages: {
      selfDependency: "Expectation '{{expectationName}}' depends on itself in the 'dependsOn' array. In context engineering, self-dependencies create logical impossibilities - an expectation cannot wait for itself to be fulfilled before it can be fulfilled. This breaks the dependency graph and makes it impossible for AI systems to generate valid execution plans. Dependencies must form directed acyclic graphs (DAGs) without self-loops. Remove the self-reference to create a valid dependency chain.",
      selfConflict: "Expectation '{{expectationName}}' conflicts with itself in the 'conflictsWith' array. In context engineering, self-conflicts are semantically meaningless - an expectation cannot be incompatible with itself. This creates contradictions in constraint satisfaction logic and prevents AI systems from performing conflict resolution. Remove the self-reference to establish a valid conflict set.",
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
          const className = node.id?.name;

          // Check dependsOn for self-references
          const dependsOn = decorator.metadata.dependsOn as unknown[] | undefined;
          if (dependsOn && dependsOn.length > 0 && className) {
            const hasSelfDependency = dependsOn.some((dep: any) => {
              // Check if any dependency references the current class
              // Handle both direct class references and object references with name property
              if (typeof dep === 'function' && dep.name === className) {
                return true;
              }
              if (dep && typeof dep === 'object' && 'name' in dep && dep.name === className) {
                return true;
              }
              return false;
            });

            if (hasSelfDependency) {
              context.report({
                node: decorator.node,
                messageId: 'selfDependency',
                data: {
                  expectationName: expectationName || className || 'Unknown',
                },
              });
            }
          }

          // Check conflictsWith for self-references
          const conflictsWith = decorator.metadata.conflictsWith as unknown[] | undefined;
          if (conflictsWith && conflictsWith.length > 0 && className) {
            const hasSelfConflict = conflictsWith.some((conf: any) => {
              // Check if any conflict references the current class
              if (typeof conf === 'function' && conf.name === className) {
                return true;
              }
              if (conf && typeof conf === 'object' && 'name' in conf && conf.name === className) {
                return true;
              }
              return false;
            });

            if (hasSelfConflict) {
              context.report({
                node: decorator.node,
                messageId: 'selfConflict',
                data: {
                  expectationName: expectationName || className || 'Unknown',
                },
              });
            }
          }
        }
      },
    };
  },
});
