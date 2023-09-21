import { ClientPage } from './ClientPage';
import { insertPrivateItemAction } from './actions';

export const dynamic = 'force-dynamic';

export default function NewItem() {
  return (
    <div className="max-w-2xl">
      <ClientPage insertPrivateItemAction={insertPrivateItemAction} />;
    </div>
  );
}
