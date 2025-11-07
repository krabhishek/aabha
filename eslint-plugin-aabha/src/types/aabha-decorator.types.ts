/**
 * Types for Aabha decorator parsing and validation
 * @module eslint-plugin-aabha/types
 */

import type { TSESTree } from '@typescript-eslint/utils';

/**
 * All supported Aabha decorator names
 */
export type AabhaDecoratorType =
  | 'Action'
  | 'Journey'
  | 'Strategy'
  | 'BusinessInitiative'
  | 'Context'
  | 'Stakeholder'
  | 'Persona'
  | 'Metric'
  | 'Expectation'
  | 'Behavior'
  | 'Witness'
  | 'Interaction'
  | 'Collaboration'
  | 'Attribute';

/**
 * Parsed decorator information extracted from AST
 */
export interface ParsedAabhaDecorator {
  /**
   * The decorator type (e.g., 'Action', 'Journey')
   */
  type: AabhaDecoratorType;

  /**
   * The extracted metadata from decorator arguments
   */
  metadata: Record<string, unknown>;

  /**
   * The AST node representing the decorator
   */
  node: TSESTree.Decorator;

  /**
   * The parent class declaration that this decorator is applied to
   */
  classNode?: TSESTree.ClassDeclaration;
}

/**
 * Schema validation result
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   */
  success: boolean;

  /**
   * Array of validation error messages if validation failed
   */
  errors?: string[];

  /**
   * Specific field paths that have errors
   */
  fieldErrors?: Array<{
    path: string[];
    message: string;
  }>;
}

/**
 * Configuration for Aabha rules
 */
export interface AabhaRuleOptions {
  /**
   * Whether to enable strict mode (all fields required)
   */
  strict?: boolean;

  /**
   * Custom patterns or validation rules
   */
  patterns?: Record<string, string>;

  /**
   * Threshold values for numeric validations
   */
  thresholds?: Record<string, number>;
}
