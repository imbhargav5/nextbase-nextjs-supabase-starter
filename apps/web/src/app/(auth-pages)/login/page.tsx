import type { Metadata } from 'next';
import { Suspense } from 'react';
import { z } from 'zod';

import { createPageMetadata } from '@/lib/seo/metadata';
import { Login } from './Login';

export const metadata: Metadata = createPageMetadata({
  title: 'Sign in',
  description:
    'Sign in to your Menace Next workspace with email, magic link, or OAuth providers.',
  path: '/login',
});

const SearchParamsSchema = z.object({
  next: z.string().optional(),
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function LoginWrapper(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { next } = SearchParamsSchema.parse(searchParams);
  return <Login next={next} />;
}

export default async function LoginPage(props: {
  searchParams: SearchParams;
}) {
  return <Suspense>
    <LoginWrapper searchParams={props.searchParams} />
  </Suspense>
}
