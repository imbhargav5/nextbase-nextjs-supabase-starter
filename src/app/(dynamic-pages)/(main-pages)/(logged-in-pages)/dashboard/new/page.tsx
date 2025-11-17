import { CreatePrivateItemForm } from '../ClientPage';

export default function NewPrivateItemPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl">
      <CreatePrivateItemForm />
    </div>
  );
}
