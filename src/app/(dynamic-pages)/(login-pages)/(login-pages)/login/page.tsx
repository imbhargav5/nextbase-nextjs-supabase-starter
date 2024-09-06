import { z } from 'zod';
import { Login } from './Login';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
  nextActionType: z.string().optional(),
});

export default function LoginPage({ searchParams }: { searchParams: unknown }) {
  const { next, nextActionType } = SearchParamsSchema.parse(searchParams);
  return <Login next={next} nextActionType={nextActionType} />;
}
