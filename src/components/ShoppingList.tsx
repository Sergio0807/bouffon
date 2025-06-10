'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '@/types';
import ItemCheckbox from './ItemCheckbox';

interface ExtendedItem extends Item {
  checkedById: string | null;
  price: number | null;
  checkedAt: Date | null;
  category?: {
    name: string;
    icon: string;
  };
}

interface ShoppingListProps {
  items: ExtendedItem[];
  users: Array<{ id: string; name: string; icon: string }>;
  onItemDelete: (itemId: string) => void;
}

export default function ShoppingList({ items: initialItems, users, onItemDelete }: ShoppingListProps) {
  const [items, setItems] = useState<ExtendedItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleItemToggle = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (!item.checked) {
      setSelectedItemId(itemId);
      setShowPriceModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          checked: false,
          price: null,
          checkedById: null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error);
        return;
      }

      setItems(items.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            checked: false,
            checkedAt: null,
            checkedById: null,
            price: null,
          };
        }
        return i;
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleValidatePrice = async () => {
    if (!selectedItemId || !price || !selectedUserId) return;

    try {
      const priceValue = parseFloat(price);
      const response = await fetch(`/api/items/${selectedItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checked: true,
          price: priceValue,
          checkedById: selectedUserId,
        }),
      });

      const updatedItem = await response.json();
      
      if (!response.ok) {
        throw new Error(updatedItem.error || 'Erreur lors de la mise à jour');
      }
      
      // Mise à jour locale uniquement après confirmation du serveur
      setItems(items.map((i) => {
        if (i.id === selectedItemId) {
          return {
            ...i,
            checked: updatedItem.checked,
            checkedAt: updatedItem.checkedAt ? new Date(updatedItem.checkedAt) : null,
            checkedById: updatedItem.checkedById,
            price: updatedItem.price,
          };
        }
        return i;
      }));

      // Fermer la modale et réinitialiser les états
      setSelectedItemId(null);
      setShowPriceModal(false);
      setPrice('');
      setSelectedUserId('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredItems = items.filter((item) => {
    switch (activeFilter) {
      case 'todo':
        return !item.checked;
      case 'done':
        return item.checked;
      default:
        return true;
    }
  });

  const totalPrice = items
    .filter((item) => item.checked && item.price)
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const totalByUser = items
    .filter((item) => item.checked && item.price && item.checkedById)
    .reduce((acc, item) => {
      const userId = item.checkedById as string;
      return {
        ...acc,
        [userId]: (acc[userId] || 0) + (item.price || 0)
      };
    }, {} as { [key: string]: number });

  return (
    <div className="space-y-4 relative">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setActiveFilter('todo')}
          className={`px-4 py-2 rounded ${activeFilter === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          À acheter
        </button>
        <button
          onClick={() => setActiveFilter('done')}
          className={`px-4 py-2 rounded ${activeFilter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Achetés
        </button>
      </div>

      {activeFilter === 'done' && (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 mb-2">Total des achats : {totalPrice.toFixed(2)}€</p>
          <div className="space-y-1">
            {Object.entries(totalByUser).map(([userId, total]) => {
              const user = users.find(u => u.id === userId);
              return user ? (
                <p key={userId} className="text-sm text-gray-600">
                  {user.icon} {user.name} : {total.toFixed(2)}€
                </p>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded shadow">
            <div className="flex items-center space-x-4">
              <ItemCheckbox
                item={item}
                onToggle={() => handleItemToggle(item.id)}
              />
              <span className={item.checked ? 'line-through text-gray-500' : ''}>
                {item.name}
                {item.category && (
                  <span className="ml-2 text-gray-500" role="img" aria-label={item.category.name}>
                    {item.category.icon}
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {item.checked && item.price && (
                <span className="text-green-600">{item.price.toFixed(2)}€</span>
              )}
              {item.checked && item.checkedById && (
                <span className="text-sm text-gray-500">
                  {users.find(u => u.id === item.checkedById)?.icon}
                </span>
              )}
              <button
                onClick={() => onItemDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ajouter le prix et l'acheteur</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-800">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acheteur
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionner un acheteur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.icon} {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowPriceModal(false);
                    setSelectedItemId(null);
                    setPrice('');
                    setSelectedUserId('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleValidatePrice}
                  disabled={!price || !selectedUserId}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
