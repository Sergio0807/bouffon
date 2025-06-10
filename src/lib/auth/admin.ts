// Note: Dans un vrai projet, utilisez des variables d'environnement et un hash sécurisé
const ADMIN_PASSWORD = 'admin123';

export function isValidAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

// Vérifier si l'utilisateur est admin (basé sur un cookie)
export function isAdmin(cookies: { [key: string]: string }) {
  return cookies['admin_auth'] === 'true';
}
