/**
 * Import management utilities for auto-fixes
 * @module eslint-plugin-aabha/utils/import-helpers
 */

import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

/**
 * Add an import to the file if it doesn't already exist
 * @param fixer - ESLint fixer instance
 * @param sourceCode - ESLint source code instance
 * @param node - The AST node (usually ClassDeclaration)
 * @param importName - The name to import (e.g., 'BehaviorComplexity')
 * @param fromModule - The module to import from (e.g., 'aabha')
 * @returns Array of fixes to add the import, or empty array if import already exists
 */
export function addImportIfMissing(
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
  node: TSESTree.Node,
  importName: string,
  fromModule: string = 'aabha'
): TSESLint.RuleFix[] {
  const source = sourceCode.getText();
  
  // Check if import already exists
  // Look for: import { ... importName ... } from 'fromModule'
  const importRegex = new RegExp(
    `import\\s*\\{[^}]*\\b${importName}\\b[^}]*\\}\\s*from\\s*['"]${fromModule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    's'
  );
  
  if (importRegex.test(source)) {
    return []; // Import already exists
  }
  
  // Find existing import from the same module
  const existingImportRegex = new RegExp(
    `import\\s*\\{([^}]*)\\}\s*from\\s*['"]${fromModule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    's'
  );
  
  const match = source.match(existingImportRegex);
  
  if (match) {
    // Add to existing import
    const existingImports = match[1].trim();
    const newImports = existingImports
      ? `${existingImports}, ${importName}`
      : importName;
    
    const importStart = match.index!;
    const beforeImports = match[0].indexOf('{') + 1;
    const afterImports = match[0].indexOf('}');
    
    return [
      fixer.replaceTextRange(
        [importStart + beforeImports, importStart + afterImports],
        newImports
      ),
    ];
  }
  
  // No existing import, add new import statement
  // Find the first import statement or the first line after any comments
  let insertPosition = 0;
  const lines = source.split('\n');
  
  // Find the last import statement
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportLine = i;
    }
  }
  
  if (lastImportLine >= 0) {
    // Insert after the last import
    const lineEnd = source.indexOf('\n', source.split('\n').slice(0, lastImportLine + 1).join('\n').length);
    insertPosition = lineEnd >= 0 ? lineEnd + 1 : source.length;
  } else {
    // Find the first non-comment, non-empty line
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        const lineStart = source.split('\n').slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
        insertPosition = lineStart;
        break;
      }
    }
  }
  
  return [
    fixer.insertTextAfterRange(
      [insertPosition, insertPosition],
      `import { ${importName} } from '${fromModule}';\n`
    ),
  ];
}

/**
 * Add multiple imports to the file if they don't already exist
 * @param fixer - ESLint fixer instance
 * @param sourceCode - ESLint source code instance
 * @param node - The AST node (usually ClassDeclaration)
 * @param importNames - Array of names to import (e.g., ['BehaviorComplexity', 'BehaviorScope'])
 * @param fromModule - The module to import from (e.g., 'aabha')
 * @returns Array of fixes to add the imports
 */
export function addImportsIfMissing(
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
  node: TSESTree.Node,
  importNames: string[],
  fromModule: string = 'aabha'
): TSESLint.RuleFix[] {
  const source = sourceCode.getText();
  
  // Find existing import from the same module (use multiline flag to handle imports across lines)
  const existingImportRegex = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${fromModule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    's'
  );
  
  const match = source.match(existingImportRegex);
  
  // Check which imports are missing
  const missingImports = importNames.filter((name) => {
    if (match && match[1]) {
      // Check if name exists in the existing import list
      const existingImports = match[1].split(',').map((s) => s.trim());
      return !existingImports.includes(name);
    }
    // If no existing import from this module, the import is missing
    // (we don't check if it's imported from elsewhere - we want it from this module)
    return true;
  });
  
  if (missingImports.length === 0) {
    return []; // All imports already exist
  }
  
  if (match && match.index !== undefined) {
    // Add to existing import
    const existingImports = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    // Combine and sort, removing duplicates
    const allImports = [...new Set([...existingImports, ...missingImports])].sort();
    const newImports = allImports.join(', ');
    
    const importStart = match.index;
    const beforeImports = match[0].indexOf('{') + 1;
    const afterImports = match[0].indexOf('}');
    
    return [
      fixer.replaceTextRange(
        [importStart + beforeImports, importStart + afterImports],
        newImports
      ),
    ];
  }
  
  // No existing import, add new import statement
  let insertPosition = 0;
  const lines = source.split('\n');
  
  // Find the last import statement
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportLine = i;
    }
  }
  
  if (lastImportLine >= 0) {
    // Insert after the last import
    const lineEnd = source.indexOf('\n', source.split('\n').slice(0, lastImportLine + 1).join('\n').length);
    insertPosition = lineEnd >= 0 ? lineEnd + 1 : source.length;
  } else {
    // Find the first non-comment, non-empty line
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        const lineStart = source.split('\n').slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
        insertPosition = lineStart;
        break;
      }
    }
  }
  
  return [
    fixer.insertTextAfterRange(
      [insertPosition, insertPosition],
      `import { ${missingImports.join(', ')} } from '${fromModule}';\n`
    ),
  ];
}

