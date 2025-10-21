/**
 * Account Opening Journey - Complete Export
 *
 * Demonstrates proper aabha hierarchy:
 * Journey → Milestone → Step → Expectation → Behavior → Test
 *
 * This is the reference implementation for all other journeys.
 */

// Level 8: Tests (bottom of hierarchy)

// Level 7: Behaviors (verified by Tests)
export * from './behaviors.js';

// Level 6: Expectations (implemented by Behaviors)
export * from './expectations.js';

// Level 5: Steps (independent entities, referenced by Milestones)
export * from './steps.js';

// Level 4: Milestones (aggregate Steps, meet Expectations)
export * from './milestones.js';

// Level 3: Journey (aggregates Milestones, links to Metrics)
export * from './journey.js';
