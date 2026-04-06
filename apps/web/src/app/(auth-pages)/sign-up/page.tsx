import { Suspense } from 'react';
import { z } from 'zod';
import { SignUp } from './Signup';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
});

async function SignUpWrapper(props: {
  searchParams: Promise<unknown>;
}) {
  const searchParams = await props.searchParams;
  const { next } = SearchParamsSchema.parse(searchParams);
  return <SignUp next={next} />;
}

export default async function SignUpPage(props: {
  searchParams: Promise<unknown>;
}) {
  return <Suspense>
    <SignUpWrapper searchParams={props.searchParams} />
  </Suspense>
}
