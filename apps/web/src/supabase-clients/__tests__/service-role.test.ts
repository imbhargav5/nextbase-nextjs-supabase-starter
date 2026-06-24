import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createServiceRoleClient } from '../service-role';

describe('createServiceRoleClient', () => {
  const original = { ...process.env };
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  });
  afterEach(() => {
    process.env = { ...original };
  });

  it('returns a client exposing a from() query builder', () => {
    const client = createServiceRoleClient();
    expect(typeof client.from).toBe('function');
  });

  it('throws when the service role key is missing', () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => createServiceRoleClient()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });
});
