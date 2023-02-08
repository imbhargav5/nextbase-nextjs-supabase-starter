'use item';
import { createContext, useContext } from 'react';

type ItemIdLayoutContextType = {
  itemId: string;
};
export const ItemIdLayoutContext = createContext<ItemIdLayoutContextType>({
  itemId: '',
});

export function useItemIdLayoutContext() {
  return useContext(ItemIdLayoutContext);
}

export function ItemIdLayoutContextProvider({
  children,
  itemId,
}: {
  children: React.ReactNode;
  itemId: string;
}) {
  return (
    <ItemIdLayoutContext.Provider value={{ itemId: itemId }}>
      {children}
    </ItemIdLayoutContext.Provider>
  );
}
