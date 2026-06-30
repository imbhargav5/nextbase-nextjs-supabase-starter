import { Suspense } from 'react';
import { z } from 'zod';
import { SignUp } from './Signup';

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
