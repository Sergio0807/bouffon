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
      throw new Error('Le nom est requis');
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
      throw new Error(data.error || 'Erreur lors de la création de l\'item');
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
      className="space-y-4 bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de l'item"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
