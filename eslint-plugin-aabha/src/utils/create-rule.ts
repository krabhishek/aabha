/**
 * Factory function for creating Aabha ESLint rules
 * @module eslint-plugin-aabha/utils/create-rule
 */

import { ESLintUtils } from '@typescript-eslint/utils';

/**
 * Rule creator with automatic documentation URL generation
 * Links to https://docs.aabha.dev/rules/{ruleName}
 */
export const createAabhaRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://docs.aabha.dev/rules/${ruleName}`
);

/**
 * Alias for createAabhaRule for convenience
 */
export const createRule = createAabhaRule;

/**
 * Helper to create consistent error message IDs
 */
export function createMessageId(prefix: string, suffix: string): string {
  return `${prefix}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
}

/**
 * Helper to format field paths for error messages
 * @example formatFieldPath(['actor', 'name']) => 'actor.name'
 */
export function formatFieldPath(path: string[]): string {
  return path.join('.');
}

/**
 * Helper to create a human-readable list from an array
 * @example formatList(['a', 'b', 'c']) => 'a, b, or c'
 */
export function formatList(items: string[], conjunction: 'and' | 'or' = 'or'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return `${rest}, ${conjunction} ${last}`;
}
