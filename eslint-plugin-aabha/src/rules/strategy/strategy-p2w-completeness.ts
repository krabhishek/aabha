/**
 * Strategy Playing to Win Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, strategies follow Roger L. Martin's **Playing to Win** framework,
 * which provides a structured approach to strategy definition. The framework consists of 5 core
 * questions that must be answered for a complete strategy. Missing framework elements create
 * incomplete strategies that AI systems can't fully understand or execute.
 *
 * The Playing to Win framework enables AI to:
 * 1. **Understand strategy intent** - Winning aspiration defines what success looks like
 * 2. **Identify market focus** - Where to play defines the competitive arena
 * 3. **Understand competitive advantage** - How to win explains differentiation
 * 4. **Identify capability gaps** - Core capabilities show what's needed
 * 5. **Plan execution systems** - Management systems enable capability building
 *
 * Incomplete frameworks mean AI can't generate accurate strategic plans or recommendations.
 *
 * **What it checks:**
 * - Strategy has `winningAspiration` (what does winning look like?)
 * - Strategy has `whereToPlay` (which markets/segments?)
 * - Strategy has `howToWin` (competitive advantage?)
 * - Strategy has `coreCapabilities` (what capabilities needed?)
 * - Strategy has `managementSystems` (systems to build capabilities?)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete P2W framework
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank by 2027',
 *   whereToPlay: ['Retail Banking', 'Gen-Z customers', 'Mobile-first channels'],
 *   howToWin: 'Instant, AI-powered financial services through mobile',
 *   coreCapabilities: ['AI/ML expertise', 'Mobile-first design', 'Real-time processing'],
 *   managementSystems: ['Monthly strategy review', 'OKR tracking', 'Capability gap analysis']
 * })
 * export class DigitalTransformationStrategy {}
 *
 * // ❌ Bad - Missing P2W elements
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank'
 *   // Missing whereToPlay, howToWin, coreCapabilities, managementSystems
 * })
 * export class DigitalTransformationStrategy {}
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingWinningAspiration'
  | 'missingWhereToPlay'
  | 'missingHowToWin'
  | 'missingCoreCapabilities'
  | 'missingManagementSystems';

export const strategyP2wCompleteness = createRule<[], MessageIds>({
  name: 'strategy-p2w-completeness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Strategies should follow the complete Playing to Win framework with all 5 core elements defined',
    },
    messages: {
      missingWinningAspiration: "Strategy '{{name}}' is missing 'winningAspiration'. The Playing to Win framework requires defining what winning looks like. Winning aspiration is the top-level goal that defines success for this strategy. Add a winningAspiration field that clearly articulates the strategic vision (e.g., 'Be the #1 digital bank by 2027').",
      missingWhereToPlay: "Strategy '{{name}}' is missing 'whereToPlay'. The Playing to Win framework requires defining the competitive arena. Where to play identifies markets, segments, geographies, or channels where the strategy will compete. Add a whereToPlay array (e.g., ['Retail Banking', 'Gen-Z customers', 'Mobile-first channels']).",
      missingHowToWin: "Strategy '{{name}}' is missing 'howToWin'. The Playing to Win framework requires defining competitive advantage. How to win explains the value proposition, differentiation, and competitive advantage that will achieve success. Add a howToWin field (e.g., 'Instant, AI-powered financial services through mobile').",
      missingCoreCapabilities: "Strategy '{{name}}' is missing 'coreCapabilities'. The Playing to Win framework requires identifying what capabilities are needed to win. Core capabilities are the essential skills, resources, or competencies required to execute the strategy. Add a coreCapabilities array (e.g., ['AI/ML expertise', 'Mobile-first design', 'Real-time processing']).",
      missingManagementSystems: "Strategy '{{name}}' is missing 'managementSystems'. The Playing to Win framework requires defining systems to build and maintain capabilities. Management systems are the processes, tools, and practices that enable capability development and strategy execution. Add a managementSystems array (e.g., ['Monthly strategy review', 'OKR tracking', 'Capability gap analysis']).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Strategy decorators
          if (decorator.type !== 'Strategy') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const winningAspiration = decorator.metadata.winningAspiration;
          const whereToPlay = decorator.metadata.whereToPlay;
          const howToWin = decorator.metadata.howToWin;
          const coreCapabilities = decorator.metadata.coreCapabilities;
          const managementSystems = decorator.metadata.managementSystems;

          if (!winningAspiration) {
            context.report({
              node: decorator.node,
              messageId: 'missingWinningAspiration',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!whereToPlay || (Array.isArray(whereToPlay) && whereToPlay.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingWhereToPlay',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!howToWin) {
            context.report({
              node: decorator.node,
              messageId: 'missingHowToWin',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!coreCapabilities || (Array.isArray(coreCapabilities) && coreCapabilities.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingCoreCapabilities',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!managementSystems || (Array.isArray(managementSystems) && managementSystems.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingManagementSystems',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});
