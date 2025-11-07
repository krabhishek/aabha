/**
 * Collaboration Artifacts Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **artifact metadata** provides essential context about
 * the materials that flow in and out of collaborations. Incomplete artifact definitions create
 * ambiguity that reduces AI comprehension and makes collaboration execution unpredictable.
 *
 * When artifact definitions lack key details (type, format, required status):
 * - **AI can't validate preparation** - Is the budget spreadsheet actually an Excel file or PDF?
 * - **Stakeholders miss expectations** - What format should the presentation be in?
 * - **Automation fails** - AI can't route or process artifacts without knowing their structure
 * - **Quality suffers** - Without format specifications, artifacts arrive in incompatible formats
 *
 * Complete artifact definitions enable:
 * 1. **Format validation** - AI can verify artifacts match expected formats (PDF, Slides, Excel)
 * 2. **Tool integration** - AI knows which tools to use for each artifact type
 * 3. **Template suggestions** - AI can suggest appropriate templates based on artifact type
 * 4. **Automated routing** - AI can route artifacts to correct systems based on format
 * 5. **Quality checks** - AI can validate artifact completeness and quality standards
 *
 * **What it checks:**
 * - Required artifacts specify type (document, presentation, spreadsheet, etc.)
 * - Required artifacts specify format when relevant (PDF, Google Slides, Excel, etc.)
 * - Produced artifacts specify type to clarify what will be created
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete artifact definitions
 * @Collaboration({
 *   name: 'Budget Review',
 *   artifactsRequired: [
 *     {
 *       name: 'Q4 Budget',
 *       type: 'spreadsheet',
 *       format: 'Excel',
 *       required: true,
 *       owner: 'Finance Team'
 *     }
 *   ],
 *   artifactsProduced: [
 *     {
 *       name: 'Approval Document',
 *       type: 'document',
 *       format: 'PDF',
 *       owner: 'CFO'
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Missing type information
 * @Collaboration({
 *   artifactsRequired: [
 *     { name: 'Project Plan', required: true }  // What type? What format?
 *   ]
 * })
 *
 * // ❌ Bad - Missing format specification
 * @Collaboration({
 *   artifactsRequired: [
 *     { name: 'Design Mockups', type: 'presentation' }  // PowerPoint? Google Slides? PDF?
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

type MessageIds = 'missingArtifactType' | 'missingArtifactFormat';

export const collaborationArtifactsCompleteness = createRule<[], MessageIds>({
  name: 'collaboration-artifacts-completeness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaboration artifacts should have complete definitions including type and format. In context engineering, detailed artifact metadata helps AI systems validate, route, and process collaboration materials effectively.',
    },
    messages: {
      missingArtifactType: "Collaboration '{{collaborationName}}' {{category}} artifact '{{artifactName}}' has no type specified. In context engineering, artifact types help AI systems understand what kind of material to expect and how to process it. Specify the artifact type (e.g., 'document', 'presentation', 'spreadsheet', 'form', 'report', 'recording', 'diagram') to enable AI validation and tool integration.",
      missingArtifactFormat: "Collaboration '{{collaborationName}}' {{category}} artifact '{{artifactName}}' has no format specified. In context engineering, format specifications enable AI systems to validate compatibility, suggest appropriate tools, and automate artifact processing. Specify the format (e.g., 'PDF', 'Google Slides', 'Excel', 'Markdown', 'Figma', 'Video') to clarify delivery expectations.",
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
            type?: string;
            format?: string;
          }> | undefined;
          const artifactsProduced = decorator.metadata.artifactsProduced as Array<{
            name: string;
            type?: string;
            format?: string;
          }> | undefined;

          // Check required artifacts
          if (artifactsRequired && Array.isArray(artifactsRequired)) {
            artifactsRequired.forEach((artifact, index) => {
              const sourceCode = context.sourceCode;

              if (!artifact.type) {
                context.report({
                  node: decorator.node,
                  messageId: 'missingArtifactType',
                  data: {
                    collaborationName: collaborationName || 'Unknown',
                    artifactName: artifact.name,
                    category: 'required',
                  },
                  fix(fixer) {
                    if (decorator.node.expression.type !== 'CallExpression') return null;

                    const arg = decorator.node.expression.arguments[0];
                    if (!arg || arg.type !== 'ObjectExpression') return null;

                    const artifactsRequiredProp = arg.properties.find(
                      (prop): prop is TSESTree.Property =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'artifactsRequired'
                    );

                    if (!artifactsRequiredProp || artifactsRequiredProp.value.type !== 'ArrayExpression') return null;

                    const artifactNode = artifactsRequiredProp.value.elements[index];
                    if (!artifactNode || artifactNode.type !== 'ObjectExpression') return null;

                    const artifactProps = artifactNode.properties;
                    if (artifactProps.length === 0) return null;

                    const lastProp = artifactProps[artifactProps.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}type: 'TODO: Specify type (document/presentation/spreadsheet/form/report/recording/diagram)'`
                    );
                  },
                });
              }

              if (!artifact.format) {
                context.report({
                  node: decorator.node,
                  messageId: 'missingArtifactFormat',
                  data: {
                    collaborationName: collaborationName || 'Unknown',
                    artifactName: artifact.name,
                    category: 'required',
                  },
                  fix(fixer) {
                    if (decorator.node.expression.type !== 'CallExpression') return null;

                    const arg = decorator.node.expression.arguments[0];
                    if (!arg || arg.type !== 'ObjectExpression') return null;

                    const artifactsRequiredProp = arg.properties.find(
                      (prop): prop is TSESTree.Property =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'artifactsRequired'
                    );

                    if (!artifactsRequiredProp || artifactsRequiredProp.value.type !== 'ArrayExpression') return null;

                    const artifactNode = artifactsRequiredProp.value.elements[index];
                    if (!artifactNode || artifactNode.type !== 'ObjectExpression') return null;

                    const artifactProps = artifactNode.properties;
                    if (artifactProps.length === 0) return null;

                    const lastProp = artifactProps[artifactProps.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}format: 'TODO: Specify format (PDF/Excel/Google Slides/Markdown/Figma/Video/etc)'`
                    );
                  },
                });
              }
            });
          }

          // Check produced artifacts
          if (artifactsProduced && Array.isArray(artifactsProduced)) {
            artifactsProduced.forEach((artifact, index) => {
              const sourceCode = context.sourceCode;

              if (!artifact.type) {
                context.report({
                  node: decorator.node,
                  messageId: 'missingArtifactType',
                  data: {
                    collaborationName: collaborationName || 'Unknown',
                    artifactName: artifact.name,
                    category: 'produced',
                  },
                  fix(fixer) {
                    if (decorator.node.expression.type !== 'CallExpression') return null;

                    const arg = decorator.node.expression.arguments[0];
                    if (!arg || arg.type !== 'ObjectExpression') return null;

                    const artifactsProducedProp = arg.properties.find(
                      (prop): prop is TSESTree.Property =>
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        prop.key.name === 'artifactsProduced'
                    );

                    if (!artifactsProducedProp || artifactsProducedProp.value.type !== 'ArrayExpression') return null;

                    const artifactNode = artifactsProducedProp.value.elements[index];
                    if (!artifactNode || artifactNode.type !== 'ObjectExpression') return null;

                    const artifactProps = artifactNode.properties;
                    if (artifactProps.length === 0) return null;

                    const lastProp = artifactProps[artifactProps.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}type: 'TODO: Specify type (document/presentation/spreadsheet/form/report/recording/diagram)'`
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
