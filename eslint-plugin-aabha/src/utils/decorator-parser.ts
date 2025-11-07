/**
 * Utility functions for parsing Aabha decorators from TypeScript ESLint AST
 * @module eslint-plugin-aabha/utils/decorator-parser
 */

import type { TSESTree } from '@typescript-eslint/utils';
import type { AabhaDecoratorType, ParsedAabhaDecorator } from '../types/aabha-decorator.types.js';

/**
 * Set of valid Aabha decorator names
 */
const AABHA_DECORATORS = new Set<string>([
  'Action',
  'Journey',
  'Strategy',
  'BusinessInitiative',
  'Context',
  'Stakeholder',
  'Persona',
  'Metric',
  'Expectation',
  'Behavior',
  'Witness',
  'Interaction',
  'Collaboration',
  'Attribute',
]);

/**
 * Check if a string is a valid Aabha decorator type
 */
export function isAabhaDecorator(name: string): name is AabhaDecoratorType {
  return AABHA_DECORATORS.has(name);
}

/**
 * Extract the decorator name from a decorator node
 */
function getDecoratorName(node: TSESTree.Decorator): string | null {
  const { expression } = node;

  // Simple decorator: @Action
  if (expression.type === 'Identifier') {
    return expression.name;
  }

  // Decorator factory: @Action({ ... })
  if (expression.type === 'CallExpression') {
    const { callee } = expression;
    if (callee.type === 'Identifier') {
      return callee.name;
    }
  }

  return null;
}

/**
 * Extract value from an AST node (literals, arrays, objects, etc.)
 */
function extractValue(node: TSESTree.Node): unknown {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'TemplateLiteral':
      // Simple template literals without expressions
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      // For complex template literals, return the raw template
      return node.quasis.map(q => q.value.raw).join('${...}');

    case 'UnaryExpression':
      // Handle negative numbers, logical NOT, etc.
      if (node.operator === '-' && node.argument.type === 'Literal') {
        return -(node.argument.value as number);
      }
      if (node.operator === '!') {
        return !extractValue(node.argument);
      }
      return undefined;

    case 'ArrayExpression':
      return node.elements.map(el => (el ? extractValue(el) : null));

    case 'ObjectExpression':
      return extractObjectLiteral(node);

    case 'Identifier':
      // Return the identifier name for enum values, class references, etc.
      return node.name;

    case 'MemberExpression':
      // Handle Enum.Value patterns
      if (
        node.object.type === 'Identifier' &&
        node.property.type === 'Identifier'
      ) {
        return `${node.object.name}.${node.property.name}`;
      }
      return undefined;

    default:
      // For unsupported types, return undefined
      return undefined;
  }
}

/**
 * Extract object literal from AST ObjectExpression node
 */
function extractObjectLiteral(node: TSESTree.ObjectExpression): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      // Get property key
      let key: string | undefined;
      if (prop.key.type === 'Identifier') {
        key = prop.key.name;
      } else if (prop.key.type === 'Literal') {
        key = String(prop.key.value);
      }

      if (key) {
        result[key] = extractValue(prop.value);
      }
    } else if (prop.type === 'SpreadElement') {
      // Handle spread properties (we can't fully resolve them without type info)
      result['...spread'] = true;
    }
  }

  return result;
}

/**
 * Parse an Aabha decorator from an AST Decorator node
 * Returns null if the decorator is not an Aabha decorator
 */
export function parseAabhaDecorator(
  node: TSESTree.Decorator
): ParsedAabhaDecorator | null {
  // Extract decorator name
  const decoratorName = getDecoratorName(node);
  if (!decoratorName || !isAabhaDecorator(decoratorName)) {
    return null;
  }

  // Extract metadata from decorator arguments
  let metadata: Record<string, unknown> = {};

  if (node.expression.type === 'CallExpression') {
    const args = node.expression.arguments;
    if (args.length > 0) {
      const firstArg = args[0];
      if (firstArg.type === 'ObjectExpression') {
        metadata = extractObjectLiteral(firstArg);
      }
    }
  }

  // Find parent class declaration
  let classNode: TSESTree.ClassDeclaration | undefined;
  if (node.parent && node.parent.type === 'ClassDeclaration') {
    classNode = node.parent;
  }

  return {
    type: decoratorName,
    metadata,
    node,
    classNode,
  };
}

/**
 * Get all Aabha decorators from a class declaration
 */
export function getAabhaDecorators(
  classNode: TSESTree.ClassDeclaration
): ParsedAabhaDecorator[] {
  const decorators = classNode.decorators ?? [];
  return decorators
    .map(parseAabhaDecorator)
    .filter((d): d is ParsedAabhaDecorator => d !== null);
}

/**
 * Get a specific decorator type from a class declaration
 */
export function getDecoratorOfType(
  classNode: TSESTree.ClassDeclaration,
  type: AabhaDecoratorType
): ParsedAabhaDecorator | null {
  const decorators = getAabhaDecorators(classNode);
  return decorators.find(d => d.type === type) ?? null;
}
