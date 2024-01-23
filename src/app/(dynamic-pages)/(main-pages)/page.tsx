import { ItemsList } from './ItemsList';
import { PrivateItemsList } from './PrivateItemsList';
import { getAllItems } from '@/data/anon/items';
import { Suspense } from 'react';
import { T } from '@/components/ui/Typography';
import { getAllPrivateItems } from '@/data/anon/privateItems';
import Footer from '@/components/tailwind/Footer';

async function Items() {
  const items = await getAllItems();
  return <ItemsList items={items} />;
}

async function PrivateItems() {
  const privateItems = await getAllPrivateItems();
  return <PrivateItemsList privateItems={privateItems} />;
}

export default async function HomePage() {
  return (
    <div className="space-y-2">
      <Suspense fallback={<T.Subtle>Loading items...</T.Subtle>}>
        <Items />
      </Suspense>
      <Suspense fallback={<T.Subtle>Loading private items...</T.Subtle>}>
        <PrivateItems />
      </Suspense>
      <Footer />
    </div>
  );
}
