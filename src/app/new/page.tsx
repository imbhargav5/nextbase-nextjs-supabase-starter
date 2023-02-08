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
      className="flex flex-col space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        //TODO: do better validation 🤷‍♂️
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        mutate({ name, description });
      }}
    >
      <div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Create Item
        </h1>
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          id="name"
          name="name"
          type="text"
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          id="description"
          name="description"
          rows={4}
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
      </div>
      <button
        className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-lg font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        type="submit"
      >
        Create Item
      </button>
    </form>
  );
}
