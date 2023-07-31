import { ClientPage } from './ClientPage';
import { insertItemAction } from '../actions';

export default function NewItem() {
  return <ClientPage insertItemAction={insertItemAction} />;
}
