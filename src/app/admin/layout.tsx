import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link 
              href="/admin"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/users"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Utilisateurs
            </Link>
            <Link 
              href="/admin/groups"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Groupes
            </Link>
            <Link 
              href="/"
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium ml-auto"
            >
              Retour à l'app
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
