import { z } from 'zod';
import { SignUp } from './Signup';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
  nextActionType: z.string().optional(),
});

export default function SignUpPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const { next, nextActionType } = SearchParamsSchema.parse(searchParams);
  return <SignUp next={next} nextActionType={nextActionType} />;
}
