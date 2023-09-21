'use client';

import { supabaseUserClientComponentClient } from '@/supabase-clients/supabaseUserClientComponentClient';
import { createSuspenseResource } from '@/utils/createSuspenseResource';
import { User } from '@supabase/supabase-js';

import { NavLink } from './NavLink';

// This will only be run on the client side and without SSR.
// We need to check if a user is logged in and show the appropriate link

const userResource = createSuspenseResource<User | null>(
  supabaseUserClientComponentClient.auth
    .getUser()
    .then(({ data }) => data?.user ?? null)
);
export function LoginNavLink() {
  const user = userResource.read();
  return user ? (
    <NavLink href="/dashboard">Dashboard</NavLink>
  ) : (
    <NavLink href="/login">Login</NavLink>
  );
}
