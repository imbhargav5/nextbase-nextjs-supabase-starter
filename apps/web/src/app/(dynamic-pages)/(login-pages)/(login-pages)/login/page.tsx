import { Suspense } from 'react';
import { z } from 'zod';
import { Login } from './Login';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
  nextActionType: z.string().optional(),
});

async function LoginWrapper(props: {
  searchParams: Promise<unknown>;
}) {
  const searchParams = await props.searchParams;
  const { next, nextActionType } = SearchParamsSchema.parse(searchParams);
  return <Login next={next} nextActionType={nextActionType} />;
}

export default async function LoginPage(props: {
  searchParams: Promise<unknown>;
}) {
  return <Suspense>
    <LoginWrapper searchParams={props.searchParams} />
  </Suspense>
}
