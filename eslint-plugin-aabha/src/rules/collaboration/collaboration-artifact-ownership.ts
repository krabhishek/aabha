/**
 * Collaboration Artifact Ownership Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, collaborations produce and consume artifacts (documents,
 * presentations, reports, recordings). **Clear artifact ownership** creates accountability and helps
 * AI systems understand who is responsible for creating, delivering, and maintaining these materials.
 *
 * Without explicit ownership, collaborations suffer from:
 * - **Ambiguous responsibility** - Nobody knows who should create the pre-read document
 * - **Missed deliverables** - Artifacts don't get created because ownership was assumed
 * - **Poor preparation** - Required artifacts arrive late or incomplete
 * - **AI comprehension gaps** - AI can't determine who to remind or what dependencies exist
 *
 * Clear artifact ownership enables:
 * 1. **Accountability tracking** - AI can identify who owns each deliverable
 * 2. **Dependency management** - AI understands which stakeholder must deliver before collaboration
 * 3. **Automated reminders** - AI can remind artifact owners before deadlines
 * 4. **Quality expectations** - Ownership clarifies who ensures artifact quality
 * 5. **Process automation** - AI can route artifacts to correct stakeholders
 *
 * **What it checks:**
 * - Required artifacts have an assigned owner (stakeholder who must provide it)
 * - Produced artifacts have an assigned owner (stakeholder who will create it)
 * - Critical required artifacts must have ownership specified
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear artifact ownership
 * @Collaboration({
 *   name: 'Sprint Planning',
 *   artifactsRequired: [
 *     { name: 'Backlog', type: 'document', required: true, owner: 'Product Owner' }
 *   ],
 *   artifactsProduced: [
 *     { name: 'Sprint Plan', type: 'document', owner: 'Scrum Master' }
 *   ]
 * })
 *
 * // ❌ Bad - Required artifact without owner
 * @Collaboration({
 *   artifactsRequired: [
 *     { name: 'Budget Report', type: 'spreadsheet', required: true }  // Who provides this?
 *   ]
 * })
 *
 * // ❌ Bad - Produced artifact without owner
 * @Collaboration({
 *   artifactsProduced: [
 *     { name: 'Meeting Minutes', type: 'document' }  // Who creates this?
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingRequiredArtifactOwner' | 'missingProducedArtifactOwner';

export const collaborationArtifactOwnership = createRule<[], MessageIds>({
  name: 'collaboration-artifact-ownership',
  meta: {
    type: 'problem',
    docs: {
      description: 'Required and produced artifacts should have clear ownership to ensure accountability. In context engineering, explicit ownership helps AI systems understand who is responsible for creating and delivering collaboration materials.',
    },
    messages: {
      missingRequiredArtifactOwner: "Collaboration '{{collaborationName}}' required artifact '{{artifactName}}' has no owner specified. In context engineering, artifact ownership creates clear accountability - AI systems need to know which stakeholder is responsible for providing this artifact. Without explicit ownership, artifacts may arrive late, be incomplete, or not arrive at all. Assign a stakeholder responsible for providing this artifact (e.g., 'Product Owner', 'Engineering Lead', 'Finance Team').",
      missingProducedArtifactOwner: "Collaboration '{{collaborationName}}' produced artifact '{{artifactName}}' has no owner specified. In context engineering, artifact ownership enables AI to track deliverables and ensure accountability. Specify which stakeholder or role is responsible for creating this artifact during or after the collaboration (e.g., 'Scrum Master' for meeting notes, 'Designer' for mockups, 'Team Lead' for decisions document).",
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
          // Only apply to Collaboration decorators
          if (decorator.type !== 'Collaboration') {
            continue;
          }

          const collaborationName = decorator.metadata.name as string | undefined;
          const artifactsRequired = decorator.metadata.artifactsRequired as Array<{
            name: string;
            required?: boolean;
            owner?: string;
          }> | undefined;
          const artifactsProduced = decorator.metadata.artifactsProduced as Array<{
            name: string;
            owner?: string;
          }> | undefined;

          // Check required artifacts
          if (artifactsRequired && Array.isArray(artifactsRequired)) {
            artifactsRequired.forEach((artifact, index) => {
              if (artifact.required && !artifact.owner) {
                const sourceCode = context.sourceCode;

                context.report({
                  node: decorator.node,
                  messageId: 'missingRequiredArtifactOwner',
                  data: {
                    collaborationName: collaborationName || 'Unknown',
                    artifactName: artifact.name,
                  },
                  fix(fixer) {
                    if (decorator.node.expression.type !== 'CallExpression') return null;

                    const arg = decorator.node.expression.arguments[0];
                    if (!arg || arg.type !== 'ObjectExpression') return null;

                    // Find artifactsRequired array
                    const artifactsRequiredProp = arg.properties.find(
                      (prop): prop is TSESTree.Property =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'artifactsRequired'
                    );

                    if (!artifactsRequiredProp || artifactsRequiredProp.value.type !== 'ArrayExpression') return null;

                    // Find the specific artifact object
                    const artifactElements = artifactsRequiredProp.value.elements;
                    const artifactNode = artifactElements[index];

                    if (!artifactNode || artifactNode.type !== 'ObjectExpression') return null;

                    // Find the last property in the artifact object
                    const artifactProps = artifactNode.properties;
                    if (artifactProps.length === 0) return null;

                    const lastProp = artifactProps[artifactProps.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}owner: 'TODO: Specify responsible stakeholder'`
                    );
                  },
                });
              }
            });
          }

          // Check produced artifacts
          if (artifactsProduced && Array.isArray(artifactsProduced)) {
            artifactsProduced.forEach((artifact, index) => {
              if (!artifact.owner) {
                const sourceCode = context.sourceCode;

                context.report({
                  node: decorator.node,
                  messageId: 'missingProducedArtifactOwner',
                  data: {
                    collaborationName: collaborationName || 'Unknown',
                    artifactName: artifact.name,
                  },
                  fix(fixer) {
                    if (decorator.node.expression.type !== 'CallExpression') return null;

                    const arg = decorator.node.expression.arguments[0];
                    if (!arg || arg.type !== 'ObjectExpression') return null;

                    // Find artifactsProduced array
                    const artifactsProducedProp = arg.properties.find(
                      (prop): prop is TSESTree.Property =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'artifactsProduced'
                    );

                    if (!artifactsProducedProp || artifactsProducedProp.value.type !== 'ArrayExpression') return null;

                    // Find the specific artifact object
                    const artifactElements = artifactsProducedProp.value.elements;
                    const artifactNode = artifactElements[index];

                    if (!artifactNode || artifactNode.type !== 'ObjectExpression') return null;

                    // Find the last property in the artifact object
                    const artifactProps = artifactNode.properties;
                    if (artifactProps.length === 0) return null;

                    const lastProp = artifactProps[artifactProps.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}owner: 'TODO: Specify responsible stakeholder'`
                    );
                  },
                });
              }
            });
          }
        }
      },
    };
  },
});
