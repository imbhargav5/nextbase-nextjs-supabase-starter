import { T } from '@/components/ui/Typography';
import { CreatePrivateItemForm } from '../ClientPage';

export default function NewPrivateItemPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl">
      <div>
        <T.H1>Create New Private Item</T.H1>
        <T.Subtle>Add a new private item that only you can access</T.Subtle>
      </div>
      <CreatePrivateItemForm />
    </div>
  );
}
