/**
 * Formatting and indentation utilities for auto-fixes
 * @module eslint-plugin-aabha/utils/formatting-helpers
 */

import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

/**
 * Detect the indentation level used in a node's source code
 * @param node - The AST node to detect indentation from
 * @param sourceCode - The ESLint source code instance
 * @returns The indentation string (spaces or tabs)
 */
export function detectIndentation(
  node: TSESTree.Node,
  sourceCode: Readonly<TSESLint.SourceCode>
): string {
  const nodeStart = node.range[0];

  // Find the start of the line containing this node
  const textBeforeNode = sourceCode.text.substring(0, nodeStart);
  const lastNewline = textBeforeNode.lastIndexOf('\n');

  // Extract the indentation (whitespace between last newline and node start)
  const lineStart = lastNewline + 1;
  const indentationText = sourceCode.text.substring(lineStart, nodeStart);

  // If we found indentation, use it; otherwise default to 2 spaces
  return indentationText.match(/^\s*$/)?.[0] || '  ';
}

/**
 * Detect indentation from the first property in an object expression
 * Falls back to detecting from the object itself if no properties exist
 * @param objNode - The object expression node
 * @param sourceCode - The ESLint source code instance
 * @returns The indentation string (spaces or tabs)
 */
export function detectObjectPropertyIndentation(
  objNode: TSESTree.ObjectExpression,
  sourceCode: Readonly<TSESLint.SourceCode>
): string {
  if (objNode.properties.length > 0) {
    const firstProp = objNode.properties[0];
    return detectIndentation(firstProp, sourceCode);
  }

  // No properties, detect from object opening brace and add one level
  const objLine = sourceCode.lines[objNode.loc.start.line - 1];
  const objIndent = objLine.match(/^(\s*)/)?.[1] || '';

  // Detect if file uses tabs or spaces
  const indentChar = objIndent.includes('\t') ? '\t' : '  ';
  return objIndent + indentChar;
}

/**
 * Get the indentation unit (single level) used in the source code
 * Analyzes the source to determine if it uses tabs or spaces, and how many spaces
 * @param sourceCode - The ESLint source code instance
 * @returns The indentation unit (e.g., '  ', '    ', or '\t')
 */
export function getIndentationUnit(
  sourceCode: Readonly<TSESLint.SourceCode>
): string {
  // Sample first 100 lines to detect indentation style
  const linesToCheck = Math.min(100, sourceCode.lines.length);
  let tabCount = 0;
  let twoSpaceCount = 0;
  let fourSpaceCount = 0;

  for (let i = 0; i < linesToCheck; i++) {
    const line = sourceCode.lines[i];
    if (line.startsWith('\t')) {
      tabCount++;
    } else if (line.startsWith('  ') && !line.startsWith('    ')) {
      twoSpaceCount++;
    } else if (line.startsWith('    ')) {
      fourSpaceCount++;
    }
  }

  // Return most common indentation style
  if (tabCount > twoSpaceCount && tabCount > fourSpaceCount) {
    return '\t';
  } else if (fourSpaceCount > twoSpaceCount) {
    return '    ';
  } else {
    return '  '; // Default to 2 spaces
  }
}

/**
 * Ensure a string ends with a comma, adding one if necessary
 * @param text - The text to check
 * @returns The text with a trailing comma
 */
export function ensureTrailingComma(text: string): string {
  return text.trimEnd().endsWith(',') ? text : text.trimEnd() + ',';
}

/**
 * Remove trailing comma from a string if present
 * @param text - The text to check
 * @returns The text without a trailing comma
 */
export function removeTrailingComma(text: string): string {
  return text.trimEnd().replace(/,$/, '');
}

/**
 * Determine if a comma is needed before inserting a new field in an object literal
 * 
 * This function analyzes the text before a closing brace to determine if a comma
 * is needed when inserting a new field. It handles cases where:
 * - The previous field ends with `]` (array) or `}` (object)
 * - There are comments between fields
 * - The object is empty (starts with `{`)
 * 
 * @param textBeforeBrace - The text content before the closing brace `}`
 * @returns true if a comma is needed, false otherwise
 * 
 * @example
 * ```typescript
 * // Text: "  postconditions: [\n    'test'\n  ]"
 * needsCommaBeforeField("  postconditions: [\n    'test'\n  ]") // returns true
 * 
 * // Text: "  name: 'test',"
 * needsCommaBeforeField("  name: 'test',") // returns false (already has comma)
 * 
 * // Text: "{"
 * needsCommaBeforeField("{") // returns false (empty object)
 * ```
 */
export function needsCommaBeforeField(textBeforeBrace: string): boolean {
  // Remove single-line comments (// ...) and trailing whitespace
  // This allows us to find the last actual character before any comments
  // The regex /\/\/.*$/gm matches // followed by any characters to end of line, globally and multiline
  const withoutComments = textBeforeBrace.replace(/\/\/.*$/gm, '').trimEnd();
  
  // Need comma if:
  // 1. Text is not empty
  // 2. Text doesn't already end with comma
  // 3. Text doesn't end with opening brace (empty object case)
  // All other cases (ending with ], }, or any other character) need a comma
  if (withoutComments.length === 0) {
    return false; // Empty object, no comma needed
  }
  
  if (withoutComments.endsWith(',')) {
    return false; // Already has comma
  }
  
  if (withoutComments.endsWith('{')) {
    return false; // Empty object, no comma needed
  }
  
  // All other cases need a comma (ends with ], }, or any other character)
  return true;
}

/**
 * Find the insertion position for a new field in an object literal
 * 
 * This function finds where to insert a new field in an object literal, handling
 * cases where there are comments after the last property. It returns the offset
 * from the start of the text where the new field should be inserted.
 * 
 * @param textBeforeBrace - The text content before the closing brace `}`
 * @param closingBraceIndex - The index of the closing brace in the source
 * @returns The offset from the start where the new field should be inserted
 */
export function findFieldInsertionPosition(
  textBeforeBrace: string,
  closingBraceIndex: number
): number {
  // Remove comments to find the last actual content
  const withoutComments = textBeforeBrace.replace(/\/\/.*$/gm, '').trimEnd();
  
  // If no content, insert right before the closing brace
  if (withoutComments.length === 0) {
    return closingBraceIndex;
  }
  
  // Find the last line that has actual content (not just comments)
  const lines = textBeforeBrace.split('\n');
  let lastContentLineIndex = -1;
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const lineWithoutComment = lines[i].replace(/\/\/.*$/, '').trim();
    if (lineWithoutComment.length > 0) {
      lastContentLineIndex = i;
      break;
    }
  }
  
  if (lastContentLineIndex >= 0) {
    // Calculate position after the last content line
    // We need to find where the last content line ends in the original text
    let position = 0;
    for (let i = 0; i <= lastContentLineIndex; i++) {
      position += lines[i].length;
      if (i < lastContentLineIndex) {
        position += 1; // Add newline character
      }
    }
    return position;
  }
  
  // Fallback: insert right before the closing brace
  return closingBraceIndex;
}
