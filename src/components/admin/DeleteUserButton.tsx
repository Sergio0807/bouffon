'use client';

export default function DeleteUserButton({
  userId,
  onDelete,
}: {
  userId: string;
  onDelete: (userId: string) => Promise<void>;
}) {
  const handleClick = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await onDelete(userId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-red-600 hover:text-red-900"
    >
      Supprimer
    </button>
  );
}
