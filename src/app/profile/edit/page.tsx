import { redirect } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';
import FooterMenu from '@/components/FooterMenu';
import { getUser } from '@/lib/auth';

export default async function EditProfilePage() {
  const user = await getUser();
  
  if (!user) {
    console.error('Session non trouvée');
    redirect('/login');
    return null;
  }

  // Préparer les données pour le formulaire
  const userData = {
    id: user.id,
    name: user.name,
    icon: user.icon || null
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier mon profil</h1>
        <EditProfileForm user={userData} />
      </div>

      <div className="pb-20">
        <FooterMenu />
      </div>
    </div>
  );
}
