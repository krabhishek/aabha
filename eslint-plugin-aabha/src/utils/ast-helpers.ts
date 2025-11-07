/**
 * AST traversal and manipulation utilities
 * @module eslint-plugin-aabha/utils/ast-helpers
 */

import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Get the class name from a ClassDeclaration node
 */
export function getClassName(node: TSESTree.ClassDeclaration): string | null {
  return node.id?.name ?? null;
}

/**
 * Check if a node is a decorator
 */
export function isDecorator(node: TSESTree.Node): node is TSESTree.Decorator {
  return node.type === 'Decorator';
}

/**
 * Check if a node is a class declaration
 */
export function isClassDeclaration(node: TSESTree.Node): node is TSESTree.ClassDeclaration {
  return node.type === 'ClassDeclaration';
}

/**
 * Get all decorators from a class declaration
 */
export function getClassDecorators(node: TSESTree.ClassDeclaration): TSESTree.Decorator[] {
  return node.decorators ?? [];
}

/**
 * Check if a class has any decorators
 */
export function hasDecorators(node: TSESTree.ClassDeclaration): boolean {
  return getClassDecorators(node).length > 0;
}

/**
 * Find parent node of a specific type
 */
export function findParentOfType<T extends TSESTree.Node>(
  node: TSESTree.Node,
  type: T['type']
): T | null {
  let current = node.parent;

  while (current) {
    if (current.type === type) {
      return current as T;
    }
    current = current.parent;
  }

  return null;
}

/**
 * Get the source code text for a node
 */
export function getNodeText(node: TSESTree.Node, sourceCode: string): string {
  if (node.range) {
    return sourceCode.slice(node.range[0], node.range[1]);
  }
  return '';
}

/**
 * Check if a node represents a literal value (string, number, boolean, null)
 */
export function isLiteralNode(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === 'Literal';
}

/**
 * Check if a node is an object expression (object literal)
 */
export function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression {
  return node.type === 'ObjectExpression';
}

/**
 * Check if a node is an array expression (array literal)
 */
export function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression {
  return node.type === 'ArrayExpression';
}

/**
 * Get property from an object expression by key name
 */
export function getObjectProperty(
  node: TSESTree.ObjectExpression,
  keyName: string
): TSESTree.Property | null {
  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      if (prop.key.type === 'Identifier' && prop.key.name === keyName) {
        return prop;
      }
      if (prop.key.type === 'Literal' && prop.key.value === keyName) {
        return prop;
      }
    }
  }
  return null;
}

/**
 * Check if an object expression has a specific property
 */
export function hasObjectProperty(
  node: TSESTree.ObjectExpression,
  keyName: string
): boolean {
  return getObjectProperty(node, keyName) !== null;
}

/**
 * Get all property keys from an object expression
 */
export function getObjectPropertyKeys(node: TSESTree.ObjectExpression): string[] {
  const keys: string[] = [];

  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      if (prop.key.type === 'Identifier') {
        keys.push(prop.key.name);
      } else if (prop.key.type === 'Literal') {
        keys.push(String(prop.key.value));
      }
    }
  }

  return keys;
}
