/**
 * Step Execution Mode Enumeration
 * @module aabha/enums/step-execution-mode
 *
 * Defines how a step executes within a journey's flow.
 * Used to model conditional branching, parallel execution, and sequential processing.
 */

/**
 * Execution Mode for Steps
 *
 * Specifies the flow control pattern for step execution:
 *
 * - **Sequential**: Default mode, steps run one after another in order
 * - **Parallel**: Step can run simultaneously with other steps in the same parallelGroup
 * - **Conditional**: Step runs only if specified condition evaluates to true
 *
 * @example
 * // Sequential step (default)
 * @Step({
 *   name: 'Enter Email',
 *   executionMode: StepExecutionMode.Sequential,
 *   order: 1
 * })
 *
 * // Conditional step
 * @Step({
 *   name: 'Manual Review',
 *   executionMode: StepExecutionMode.Conditional,
 *   condition: 'aiConfidence < 95',
 *   order: 7
 * })
 *
 * // Parallel step
 * @Step({
 *   name: 'Issue Virtual Card',
 *   executionMode: StepExecutionMode.Parallel,
 *   parallelGroup: 'card-issuance',
 *   order: 9
 * })
 */
export enum StepExecutionMode {
  /**
   * Sequential execution (default)
   * Step runs in strict order after previous step completes
   *
   * Use when:
   * - Step depends on previous step's output
   * - Order matters for business logic
   * - No parallelization is possible
   *
   * Example: Email verification must happen after email entry
   */
  Sequential = 'sequential',

  /**
   * Parallel execution
   * Step can run simultaneously with other steps in same parallelGroup
   *
   * Use when:
   * - Step is independent of other parallel steps
   * - Can optimize journey duration via parallelization
   * - No data dependencies exist
   *
   * Example: Issuing virtual card and ordering physical card can happen simultaneously
   */
  Parallel = 'parallel',

  /**
   * Conditional execution
   * Step runs only if specified condition evaluates to true
   *
   * Use when:
   * - Step is optional based on runtime state
   * - Branching logic required
   * - Different paths based on previous step results
   *
   * Example: Manual review only needed if AI confidence is below threshold
   */
  Conditional = 'conditional',
}
