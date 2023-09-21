import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '@/utils/supabase-queries';
import { ConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';
import { T } from '@/components/ui/Typography';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';
import { deleteItemAction } from '../../actions';

export default async function Item({
  params,
}: {
  params: {
    itemId: string;
  };
}) {
  const supabaseClient = createSupabaseServerComponentClient();

  const { itemId } = params;
  try {
    const item = await getItem(supabaseClient, itemId);
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
        <div className="flex">
          <ConfirmDeleteItemDialog
            deleteItemAction={deleteItemAction}
            itemId={itemId}
          />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
