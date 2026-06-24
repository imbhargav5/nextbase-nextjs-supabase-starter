import { describe, expect, it } from 'vitest';
import { buildWidgetConfig } from '../config';

describe('buildWidgetConfig', () => {
  it('returns inactive for a missing project', () => {
    expect(buildWidgetConfig(null)).toEqual({ active: false });
  });
  it('returns inactive when the project is disabled', () => {
    expect(buildWidgetConfig({ id: 'p1', is_active: false })).toEqual({ active: false });
  });
  it('returns active config with theme defaults when enabled', () => {
    const result = buildWidgetConfig({ id: 'p1', is_active: true });
    expect(result.active).toBe(true);
    expect(result).toHaveProperty('theme');
  });
});
