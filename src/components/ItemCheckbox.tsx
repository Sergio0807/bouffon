'use client';

import { useState } from 'react';
import { Item } from '@/types';

type ExtendedItem = Item & {
  checkedById: string | null;
  price: number | null;
};

type ItemCheckboxProps = {
  item: ExtendedItem;
  onToggle: () => void;
};

export default function ItemCheckbox({ item, onToggle }: ItemCheckboxProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = () => {
    if (isUpdating) return;
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className={`
        w-8 h-8 rounded-full
        ${item.checked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'}
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span className="sr-only">
        {item.checked ? 'Marquer comme non acheté' : 'Marquer comme acheté'}
      </span>
    </button>
  );
}
