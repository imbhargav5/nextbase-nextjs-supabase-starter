'use client';

import { useInsertItem } from '../utils/react-query-hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewItem() {
  const router = useRouter();
  const { mutate } = useInsertItem({
    onSuccess: () => {
      router.push('/');
    },
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <form
      className="flex flex-col space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        //TODO: do better validation 🤷‍♂️
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        mutate({ name, description });
      }}
    >
      <label htmlFor="name">Name</label>
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        id="name"
        name="name"
        type="text"
      />
      <label htmlFor="description">Description</label>
      <input
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
        id="description"
        name="description"
        type="text"
      />
      <button type="submit">Create Item</button>
    </form>
  );
}
