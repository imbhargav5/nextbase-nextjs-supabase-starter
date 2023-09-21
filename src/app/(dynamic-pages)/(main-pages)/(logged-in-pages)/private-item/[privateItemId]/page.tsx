import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPrivateItem } from '@/utils/supabase-queries';
import { T } from '@/components/ui/Typography';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';

export default async function PrivateItem({
  params,
}: {
  params: {
    privateItemId: string;
  };
}) {
  const supabaseClient = createSupabaseServerComponentClient();

  const { privateItemId } = params;
  try {
    const item = await getPrivateItem(supabaseClient, privateItemId);
    return (
      <div className="space-y-2">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm text-blue-600 text-underline flex items-center space-x-2"
          >
            <ArrowLeft /> <span>Back to dashboard</span>
          </Link>
          <T.H1>{item.name}</T.H1>
          <T.Subtle>Description: {item.description}</T.Subtle>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
