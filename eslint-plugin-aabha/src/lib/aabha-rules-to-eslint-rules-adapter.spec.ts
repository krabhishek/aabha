import { aabhaRulesToEslintRulesAdapter } from './aabha-rules-to-eslint-rules-adapter.js';

describe('aabhaRulesToEslintRulesAdapter', () => {
  it('should work', () => {
    expect(aabhaRulesToEslintRulesAdapter()).toEqual(
      'aabha-rules-to-eslint-rules-adapter',
    );
  });
});
