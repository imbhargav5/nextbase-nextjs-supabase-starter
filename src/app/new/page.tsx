import { ClientPage } from './ClientPage';
import { insertItemAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function NewItem() {
  return <ClientPage insertItemAction={insertItemAction} />;
}
