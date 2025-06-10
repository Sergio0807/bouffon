'use client';

import { useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';

type AddItemProps = {
  groupId: string;
};

export default function AddItem({ groupId }: AddItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function addItem(formData: FormData): Promise<void> {
    const name = formData.get('name') as string;

    if (!name) {
      throw new Error('Nom requis');
    }

    const res = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        name,
        groupId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de l\'ajout');
    }

    startTransition(() => {
      router.refresh();
    });

    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={addItem}
      className="space-y-4 bg-white p-4 rounded-lg shadow-sm md:p-6"
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Article
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nom de l'article"
          required
        />
      </div>



      <div className="mt-8">
        <button
          type="submit"
          className="fixed md:static bottom-20 left-4 right-4 md:w-full py-3 md:py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed z-10 max-w-4xl mx-auto md:mx-0"
          disabled={isPending}
          onClick={(e) => e.stopPropagation()}
        >
          {isPending ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
