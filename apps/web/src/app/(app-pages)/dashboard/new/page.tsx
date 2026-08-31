import { CreatePrivateItemForm } from '../ClientPage';
import { PageHeader } from '@/components/page-header';
import { LockKeyhole } from 'lucide-react';

export default function NewPrivateItemPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Create Private Item"
        description="Add a record to your protected workspace."
        badge={
          <span className="flex items-center gap-1.5">
            <LockKeyhole className="size-3" aria-hidden="true" />
            Private
          </span>
        }
      />
      <CreatePrivateItemForm />
    </div>
  );
}
