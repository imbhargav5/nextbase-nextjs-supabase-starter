import type { Metadata } from 'next';
import { Suspense } from 'react';
import { z } from 'zod';

import { createPageMetadata } from '@/lib/seo/metadata';
import { SignUp } from './Signup';

export const metadata: Metadata = createPageMetadata({
  title: 'Create account',
  description:
    'Create your Menace Next account and explore the protected SaaS workspace in minutes.',
  path: '/sign-up',
});

const SearchParamsSchema = z.object({
  next: z.string().optional(),
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function SignUpWrapper(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { next } = SearchParamsSchema.parse(searchParams);
  return <SignUp next={next} />;
}

export default async function SignUpPage(props: {
  searchParams: SearchParams;
}) {
  return <Suspense>
    <SignUpWrapper searchParams={props.searchParams} />
  </Suspense>
}
