'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
  icon: string;
};

type AddItemFormProps = {
  groupId: string;
  onItemAdded?: (item: any) => void;
};

export default function AddItemForm({ groupId, onItemAdded }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Charger les catégories au montage du composant
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des catégories');
        }
        const data = await response.json();
        console.log('Catégories chargées:', data);
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les catégories');
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    console.log('Soumission du formulaire avec:', {
      name,
      groupId,
      selectedCategory
    });

    try {
      if (!selectedCategory) {
        setError('Veuillez sélectionner une catégorie');
        return;
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          groupId,
          categoryId: selectedCategory,
        }),
        credentials: 'same-origin'
      });

      console.log('Réponse du serveur:', response.status);

      const data = await response.json();
      console.log('Réponse création item:', data);

      if (!response.ok) {
        console.error('Erreur création item:', {
          status: response.status,
          data: data
        });
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'article');
      }

      // Appeler la fonction de callback si elle existe
      if (onItemAdded) {
        onItemAdded(data);
      }
      
      // Réinitialiser le formulaire
      setName('');
      setError('');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Article
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de l'article"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    } transition-colors duration-200`}
                >
                  <span className="text-xl" role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                  <span className="text-sm truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedCategory}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}
