import { describe, expect, it } from 'vitest';
import { normalizeFeedbackFilters } from '../feedback-filters';

describe('normalizeFeedbackFilters', () => {
  it("drops empty and 'all' values", () => {
    expect(
      normalizeFeedbackFilters({ status: 'all', type: '', projectId: undefined, q: '  ' })
    ).toEqual({});
  });
  it('keeps valid status/type/project and trims search', () => {
    expect(
      normalizeFeedbackFilters({ status: 'new', type: 'bug', projectId: 'p1', q: '  crash ' })
    ).toEqual({ status: 'new', type: 'bug', projectId: 'p1', q: 'crash' });
  });
  it('ignores invalid status/type', () => {
    expect(normalizeFeedbackFilters({ status: 'bogus', type: 'nope' })).toEqual({});
  });
});
